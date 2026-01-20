package com.freetrader.service;

import com.freetrader.util.CacheKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Redis 缓存服务
 * 提供统一的缓存操作接口，包括 Token 黑名单、用户缓存、板块缓存等
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    /** SCAN 命令每次迭代返回的最大数量 */
    private static final int SCAN_COUNT = 100;

    /**
     * 设置缓存，带过期时间
     */
    public void set(String key, Object value, long timeout, TimeUnit unit) {
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } catch (Exception e) {
            log.error("Redis set error: key={}", key, e);
        }
    }

    /**
     * 获取缓存值
     */
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis get error: key={}", key, e);
            return null;
        }
    }

    /**
     * 删除单个缓存
     */
    public boolean delete(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.delete(key));
        } catch (Exception e) {
            log.error("Redis delete error: key={}", key, e);
            return false;
        }
    }

    /**
     * 检查 key 是否存在
     */
    public boolean hasKey(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Redis hasKey error: key={}", key, e);
            return false;
        }
    }

    // ==================== Token 黑名单操作 ====================

    /**
     * 将 Token 加入黑名单
     */
    public void addToTokenBlacklist(String token, long expirationMs) {
        String key = CacheKeys.tokenBlacklist(token);
        set(key, "1", expirationMs, TimeUnit.MILLISECONDS);
        log.debug("Token added to blacklist: {}", key);
    }

    /**
     * 检查 Token 是否在黑名单中
     */
    public boolean isTokenBlacklisted(String token) {
        String key = CacheKeys.tokenBlacklist(token);
        return hasKey(key);
    }

    // ==================== 用户收藏缓存操作 ====================

    /**
     * 缓存用户收藏的板块 ID 列表
     */
    public void setUserFavorites(Integer userId, List<Integer> cids, long timeout, TimeUnit unit) {
        String key = CacheKeys.userFavorites(userId);
        set(key, cids, timeout, unit);
        log.debug("缓存用户收藏: userId={}, count={}", userId, cids.size());
    }

    /**
     * 获取用户收藏的板块 ID 列表
     */
    @SuppressWarnings("unchecked")
    public List<Integer> getUserFavorites(Integer userId) {
        String key = CacheKeys.userFavorites(userId);
        try {
            Object value = get(key);
            if (value instanceof List) {
                return (List<Integer>) value;
            }
            return null;
        } catch (Exception e) {
            log.error("获取用户收藏缓存失败: userId={}", userId, e);
            return null;
        }
    }

    /**
     * 清除用户收藏缓存
     */
    public void clearUserFavoritesCache(Integer userId) {
        String key = CacheKeys.userFavorites(userId);
        delete(key);
        log.debug("清除用户收藏缓存: userId={}", userId);
    }

    // ==================== 批量删除操作（使用 SCAN 代替 KEYS） ====================

    /**
     * 根据模式删除 key，使用 SCAN 命令避免阻塞
     * <p>
     * 注意：生产环境中 KEYS 命令会阻塞 Redis，此方法使用 SCAN 替代
     * </p>
     */
    public void deleteByPattern(String pattern) {
        try {
            Set<String> keys = scanKeys(pattern);
            if (!keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.debug("Deleted {} keys matching pattern: {}", keys.size(), pattern);
            }
        } catch (Exception e) {
            log.error("Redis deleteByPattern error: pattern={}", pattern, e);
        }
    }

    /**
     * 使用 SCAN 命令扫描匹配的 key
     * <p>
     * 相比 KEYS 命令，SCAN 是渐进式的，不会阻塞 Redis
     * </p>
     */
    private Set<String> scanKeys(String pattern) {
        Set<String> keys = new HashSet<>();

        redisTemplate.execute((RedisCallback<Void>) connection -> {
            ScanOptions options = ScanOptions.scanOptions()
                    .match(pattern)
                    .count(SCAN_COUNT)
                    .build();

            try (Cursor<byte[]> cursor = connection.keyCommands().scan(options)) {
                while (cursor.hasNext()) {
                    keys.add(new String(cursor.next(), StandardCharsets.UTF_8));
                }
            } catch (Exception e) {
                log.error("SCAN 操作失败: pattern={}", pattern, e);
            }
            return null;
        });

        return keys;
    }

    // ==================== 板块缓存操作 ====================

    /**
     * 清除所有板块相关缓存
     */
    public void clearSectorCache() {
        deleteByPattern(CacheKeys.SECTOR_CACHE_PREFIX + "*");
        deleteByPattern(CacheKeys.sectorsCachePattern());
        deleteByPattern(CacheKeys.sectorDetailCachePattern());
        log.info("板块缓存已清除");
    }

    /**
     * 清除指定用户的所有缓存
     */
    public void clearUserCache(Integer userId) {
        deleteByPattern(CacheKeys.userCachePattern(userId));
        clearUserFavoritesCache(userId);
        log.debug("用户缓存已清除: userId={}", userId);
    }
}
