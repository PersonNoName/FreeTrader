package com.freetrader.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.UserCollection;
import com.freetrader.exception.BusinessException;
import com.freetrader.exception.ErrorCode;
import com.freetrader.mapper.UserCollectionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 收藏服务
 * 处理用户板块收藏的增删查操作
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserCollectionMapper userCollectionMapper;
    private final SectorService sectorService;

    /**
     * 获取用户收藏的板块列表
     */
    public List<SectorDTO> getFavoriteSectors(Integer userId) {
        List<Integer> favoriteCids = userCollectionMapper.findFavoriteCidsByUserId(userId);
        Set<Integer> favoriteSet = favoriteCids != null ? Set.copyOf(favoriteCids) : Set.of();

        return sectorService.getAllSectors(userId).stream()
                .filter(s -> favoriteSet.contains(s.getId()))
                .collect(Collectors.toList());
    }

    /**
     * 添加板块到收藏
     */
    @CacheEvict(value = "userFavorites", key = "#userId")
    @Transactional
    public void addFavorite(Integer userId, Integer cid) {
        // 检查是否已收藏
        Long count = userCollectionMapper.selectCount(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (count > 0) {
            throw new BusinessException(ErrorCode.FAVORITE_EXISTS);
        }

        UserCollection collection = new UserCollection();
        collection.setUserId(userId);
        collection.setCid(cid);
        userCollectionMapper.insert(collection);

        log.info("用户添加收藏: userId={}, cid={}", userId, cid);
    }

    /**
     * 移除板块收藏
     */
    @CacheEvict(value = "userFavorites", key = "#userId")
    @Transactional
    public void removeFavorite(Integer userId, Integer cid) {
        int deleted = userCollectionMapper.delete(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (deleted == 0) {
            throw new BusinessException(ErrorCode.FAVORITE_NOT_FOUND);
        }

        log.info("用户移除收藏: userId={}, cid={}", userId, cid);
    }

    /**
     * 切换板块收藏状态
     * 
     * @return true-已收藏，false-未收藏
     */
    @CacheEvict(value = "userFavorites", key = "#userId")
    @Transactional
    public boolean toggleFavorite(Integer userId, Integer cid) {
        Long count = userCollectionMapper.selectCount(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (count > 0) {
            userCollectionMapper.delete(
                    new QueryWrapper<UserCollection>()
                            .eq("user_id", userId)
                            .eq("cid", cid));
            log.info("用户取消收藏: userId={}, cid={}", userId, cid);
            return false;
        } else {
            UserCollection collection = new UserCollection();
            collection.setUserId(userId);
            collection.setCid(cid);
            userCollectionMapper.insert(collection);
            log.info("用户添加收藏: userId={}, cid={}", userId, cid);
            return true;
        }
    }
}
