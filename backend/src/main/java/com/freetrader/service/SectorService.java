package com.freetrader.service;

import com.freetrader.dto.EtfDTO;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.Category;
import com.freetrader.mapper.CalendarMapper;
import com.freetrader.mapper.CategoryMapper;
import com.freetrader.mapper.EtfInfoMapper;
import com.freetrader.mapper.UserCollectionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final CategoryMapper categoryMapper;
    private final EtfInfoMapper etfInfoMapper;
    private final CalendarMapper calendarMapper;
    private final UserCollectionMapper userCollectionMapper;

    @Value("${app.trading-days:7}")
    private int defaultTradingDays;

    @Value("${app.top-funds:10}")
    private int defaultTopFunds;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    /**
     * Get trading day range
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
     * Get all sectors with average performance
     */
    public List<SectorDTO> getAllSectors(Integer userId) {
        List<String> tradingDays = getTradingDayRange(defaultTradingDays);

        String latestDay = tradingDays.isEmpty() ? LocalDate.now().format(DATE_FORMATTER) : tradingDays.get(0);
        String earliestDay = tradingDays.isEmpty()
                ? LocalDate.now().minusDays(defaultTradingDays).format(DATE_FORMATTER)
                : tradingDays.get(tradingDays.size() - 1);

        List<SectorDTO> sectors = categoryMapper.findAllSectorsWithAvgChange(latestDay, earliestDay);

        // Get user favorites
        Set<Integer> favoriteCids = new HashSet<>();
        if (userId != null) {
            List<Integer> cids = userCollectionMapper.findFavoriteCidsByUserId(userId);
            if (cids != null) {
                favoriteCids.addAll(cids);
            }
        }

        // Enrich sector data
        for (SectorDTO sector : sectors) {
            sector.setIsFavorite(favoriteCids.contains(sector.getId()));

            // Calculate market cap placeholder
            if (sector.getFundsCount() != null) {
                double estimatedCap = sector.getFundsCount() * 50; // Placeholder formula
                if (estimatedCap >= 1000) {
                    sector.setMarketCap(String.format("%.1fT", estimatedCap / 1000));
                } else {
                    sector.setMarketCap(String.format("%.1fB", estimatedCap));
                }
            } else {
                sector.setMarketCap("N/A");
            }

            // Calculate price placeholder (based on avg change)
            double basePrice = 1000.0;
            double change = sector.getChange() != null ? sector.getChange() : 0.0;
            sector.setPrice(basePrice * (1 + change / 100));

            // Generate trend data (simulated based on change direction)
            sector.setTrend(generateTrendData(change));
        }

        return sectors;
    }

    /**
     * Get sector detail with top performing funds
     */
    public Map<String, Object> getSectorDetail(Integer sectorId, Integer userId) {
        // Get sector info
        Category category = categoryMapper.selectById(sectorId);
        if (category == null) {
            throw new RuntimeException("板块不存在");
        }

        List<String> tradingDays = getTradingDayRange(defaultTradingDays);
        String latestDay = tradingDays.isEmpty() ? LocalDate.now().format(DATE_FORMATTER) : tradingDays.get(0);
        String earliestDay = tradingDays.isEmpty()
                ? LocalDate.now().minusDays(defaultTradingDays).format(DATE_FORMATTER)
                : tradingDays.get(tradingDays.size() - 1);

        // Get top funds
        List<EtfDTO> topFunds = etfInfoMapper.findTopEtfsBySector(
                category.getName(),
                latestDay,
                earliestDay,
                defaultTopFunds);

        // Enrich fund data with display properties
        String[] bgColors = { "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600", "bg-red-600",
                "bg-indigo-600", "bg-pink-600", "bg-teal-600" };
        for (int i = 0; i < topFunds.size(); i++) {
            EtfDTO fund = topFunds.get(i);
            // Use first character of chinese name for icon, fallback to code
            String iconChar = fund.getFullName() != null && !fund.getFullName().isEmpty() 
                    ? fund.getFullName().substring(0, 1) 
                    : (fund.getName() != null ? fund.getName().substring(0, 1).toUpperCase() : "F");
            fund.setIcon(iconChar);
            fund.setIconBg(bgColors[i % bgColors.length]);
            fund.setIconColor("text-white");
            fund.setFcfShare(Math.random() * 5); // Placeholder
            fund.setMktCap(String.format("%.1fB", Math.random() * 10 + 1)); // Placeholder
            fund.setIsFavorite(false); // Stock-level favorites not implemented yet
        }

        // Check if sector is favorited
        boolean isFavorite = false;
        if (userId != null) {
            List<Integer> cids = userCollectionMapper.findFavoriteCidsByUserId(userId);
            isFavorite = cids != null && cids.contains(sectorId);
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
     * Generate trend data for sparkline visualization
     */
    private List<Double> generateTrendData(Double change) {
        List<Double> trend = new ArrayList<>();
        double base = 10.0;
        double direction = change != null && change >= 0 ? 0.3 : -0.3;

        Random random = new Random();
        for (int i = 0; i < 7; i++) {
            double value = base + (i * direction) + (random.nextDouble() - 0.5) * 2;
            trend.add(Math.round(value * 10) / 10.0);
        }

        return trend;
    }
}
