package com.freetrader.service;

import com.freetrader.config.SectorProperties;
import com.freetrader.dto.EtfDTO;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.Category;
import com.freetrader.exception.BusinessException;
import com.freetrader.exception.ErrorCode;
import com.freetrader.mapper.CalendarMapper;
import com.freetrader.mapper.CategoryMapper;
import com.freetrader.mapper.EtfInfoMapper;
import com.freetrader.mapper.UserCollectionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 板块服务
 * 提供 ETF 板块数据查询、计算和缓存功能
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SectorService {

    private final CategoryMapper categoryMapper;
    private final EtfInfoMapper etfInfoMapper;
    private final CalendarMapper calendarMapper;
    private final UserCollectionMapper userCollectionMapper;
    private final SectorProperties sectorProperties;

    @Value("${app.trading-days:7}")
    private int defaultTradingDays;

    @Value("${app.top-funds:10}")
    private int defaultTopFunds;

    @Value("${app.sector.estimated-cap-multiplier:50}")
    private double estimatedCapMultiplier;

    @Value("${app.sector.base-price:1000.0}")
    private double basePrice;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    /**
     * 获取交易日范围
     */
    private List<String> getTradingDayRange(int days) {
        String today = LocalDate.now().format(DATE_FORMATTER);
        List<String> tradingDays = calendarMapper.findLastNTradingDays(today, days);

        if (tradingDays == null || tradingDays.isEmpty()) {
            // Fallback: use last N actual days
            return List.of(
                    LocalDate.now().minusDays(days - 1).format(DATE_FORMATTER),
                    today);
        }

        return tradingDays;
    }

    /**
     * 获取用户收藏的板块 ID 列表（带缓存）
     * 使用 Spring Cache 抽象，统一缓存策略
     */
    @Cacheable(value = "userFavorites", key = "#userId", unless = "#userId == null")
    public Set<Integer> getUserFavorites(Integer userId) {
        if (userId == null) {
            return Collections.emptySet();
        }

        log.debug("从数据库加载用户收藏: userId={}", userId);
        List<Integer> cids = userCollectionMapper.findFavoriteCidsByUserId(userId);
        if (cids == null) {
            return Collections.emptySet();
        }
        return new HashSet<>(cids);
    }

    /**
     * 获取所有板块（带平均涨跌幅）
     */
    public List<SectorDTO> getAllSectors(Integer userId) {
        List<SectorDTO> sectors = getBaseSectors();

        Set<Integer> favoriteCids = getUserFavorites(userId);

        for (SectorDTO sector : sectors) {
            sector.setIsFavorite(favoriteCids.contains(sector.getId()));
        }

        return sectors;
    }

    /**
     * 获取板块基础数据（带缓存）
     */
    @Cacheable(value = "sectors", key = "'base_sectors'")
    public List<SectorDTO> getBaseSectors() {
        log.debug("从数据库加载板块基础数据");
        List<String> tradingDays = getTradingDayRange(defaultTradingDays);

        String latestDay = tradingDays.isEmpty() ? LocalDate.now().format(DATE_FORMATTER) : tradingDays.get(0);
        String earliestDay = tradingDays.isEmpty()
                ? LocalDate.now().minusDays(defaultTradingDays).format(DATE_FORMATTER)
                : tradingDays.get(tradingDays.size() - 1);

        List<SectorDTO> sectors = categoryMapper.findAllSectorsWithAvgChange(latestDay, earliestDay);

        for (SectorDTO sector : sectors) {
            enrichSectorData(sector);
        }

        return sectors;
    }

    /**
     * 丰富板块数据（计算市值、价格、走势）
     */
    private void enrichSectorData(SectorDTO sector) {
        // 计算估算市值
        if (sector.getFundsCount() != null) {
            double estimatedCap = sector.getFundsCount() * estimatedCapMultiplier;
            if (estimatedCap >= 1000) {
                sector.setMarketCap(String.format("%.1fT", estimatedCap / 1000));
            } else {
                sector.setMarketCap(String.format("%.1fB", estimatedCap));
            }
        } else {
            sector.setMarketCap("N/A");
        }

        // 计算价格
        double change = sector.getChange() != null ? sector.getChange() : 0.0;
        sector.setPrice(basePrice * (1 + change / 100));

        // 生成走势数据
        sector.setTrend(generateTrendData(change));
    }

    /**
     * 获取板块详情（带表现最好的 ETF 列表）
     */
    @Cacheable(value = "sectorDetail", key = "#sectorId")
    public Map<String, Object> getSectorDetail(Integer sectorId, Integer userId) {
        log.debug("从数据库加载板块详情: sectorId={}", sectorId);

        Category category = categoryMapper.selectById(sectorId);
        if (category == null) {
            log.warn("板块不存在: sectorId={}", sectorId);
            throw new BusinessException(ErrorCode.SECTOR_NOT_FOUND);
        }

        List<String> tradingDays = getTradingDayRange(defaultTradingDays);
        String latestDay = tradingDays.isEmpty() ? LocalDate.now().format(DATE_FORMATTER) : tradingDays.get(0);
        String earliestDay = tradingDays.isEmpty()
                ? LocalDate.now().minusDays(defaultTradingDays).format(DATE_FORMATTER)
                : tradingDays.get(tradingDays.size() - 1);

        // 获取板块下表现最好的 ETF
        List<EtfDTO> topFunds = etfInfoMapper.findTopEtfsBySector(
                category.getName(),
                latestDay,
                earliestDay,
                defaultTopFunds);

        // 检查板块是否已收藏
        boolean isFavorite = false;
        if (userId != null) {
            Set<Integer> favoriteCids = getUserFavorites(userId);
            isFavorite = favoriteCids.contains(sectorId);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", category.getCid());
        result.put("name", category.getName());
        result.put("description", category.getDescription());
        result.put("fundsCount", category.getItemCount());
        result.put("isFavorite", isFavorite);
        result.put("funds", topFunds);

        return result;
    }

    /**
     * 生成走势数据（用于 Sparkline 展示）
     */
    private List<Double> generateTrendData(Double change) {
        List<Double> trend = new ArrayList<>();
        double base = sectorProperties.getTrendBaseValue();
        double directionFactor = sectorProperties.getTrendDirectionFactor();
        double direction = change != null && change >= 0 ? directionFactor : -directionFactor;
        int dataPoints = sectorProperties.getTrendDataPoints();
        double volatility = sectorProperties.getTrendVolatility();

        Random random = new Random();
        for (int i = 0; i < dataPoints; i++) {
            double value = base + (i * direction) + (random.nextDouble() - 0.5) * volatility;
            trend.add(Math.round(value * 10) / 10.0);
        }

        return trend;
    }
}
