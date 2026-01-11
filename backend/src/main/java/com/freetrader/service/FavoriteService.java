package com.freetrader.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.UserCollection;
import com.freetrader.mapper.UserCollectionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserCollectionMapper userCollectionMapper;
    private final SectorService sectorService;

    /**
     * Get user's favorite sectors
     */
    public List<SectorDTO> getFavoriteSectors(Integer userId) {
        List<Integer> favoriteCids = userCollectionMapper.findFavoriteCidsByUserId(userId);
        Set<Integer> favoriteSet = favoriteCids != null ? Set.copyOf(favoriteCids) : Set.of();

        return sectorService.getAllSectors(userId).stream()
                .filter(s -> favoriteSet.contains(s.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Add sector to favorites
     */
    @Transactional
    public void addFavorite(Integer userId, Integer cid) {
        // Check if already favorited
        Long count = userCollectionMapper.selectCount(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (count > 0) {
            throw new RuntimeException("已收藏该板块");
        }

        UserCollection collection = new UserCollection();
        collection.setUserId(userId);
        collection.setCid(cid);
        userCollectionMapper.insert(collection);
    }

    /**
     * Remove sector from favorites
     */
    @Transactional
    public void removeFavorite(Integer userId, Integer cid) {
        int deleted = userCollectionMapper.delete(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (deleted == 0) {
            throw new RuntimeException("未收藏该板块");
        }
    }

    /**
     * Toggle sector favorite status
     */
    @Transactional
    public boolean toggleFavorite(Integer userId, Integer cid) {
        Long count = userCollectionMapper.selectCount(
                new QueryWrapper<UserCollection>()
                        .eq("user_id", userId)
                        .eq("cid", cid));

        if (count > 0) {
            removeFavorite(userId, cid);
            return false;
        } else {
            addFavorite(userId, cid);
            return true;
        }
    }
}
