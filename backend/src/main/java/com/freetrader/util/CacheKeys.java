package com.freetrader.util;

/**
 * 缓存键常量类
 * 统一管理所有 Redis 缓存的 key 前缀和生成方法
 * 确保 @Cacheable 注解和 RedisTemplate 使用一致的键格式
 */
public final class CacheKeys {

    private CacheKeys() {
        // 工具类禁止实例化
    }

    // ==================== 缓存名称（用于 @Cacheable value） ====================

    /** 板块列表缓存 */
    public static final String SECTORS = "sectors";

    /** 板块详情缓存 */
    public static final String SECTOR_DETAIL = "sectorDetail";

    /** 用户收藏缓存 */
    public static final String USER_FAVORITES = "userFavorites";

    /** 用户信息缓存 */
    public static final String USER_INFO = "userInfo";

    // ==================== Redis Key 前缀（用于直接操作 RedisTemplate） ====================

    /** Token 黑名单前缀 */
    public static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    /** 用户缓存前缀 */
    public static final String USER_CACHE_PREFIX = "user:";

    /** 板块缓存前缀 */
    public static final String SECTOR_CACHE_PREFIX = "sector:";

    // ==================== Key 生成方法 ====================

    /**
     * 生成 Token 黑名单 key
     */
    public static String tokenBlacklist(String token) {
        return TOKEN_BLACKLIST_PREFIX + token;
    }

    /**
     * 生成用户收藏缓存 key
     * 格式与 Spring Cache 保持一致: userFavorites::userId
     */
    public static String userFavorites(Integer userId) {
        return USER_FAVORITES + "::" + userId;
    }

    /**
     * 生成用户缓存 key 模式（用于批量删除）
     */
    public static String userCachePattern(Integer userId) {
        return USER_CACHE_PREFIX + userId + ":*";
    }

    /**
     * 生成板块缓存 key 模式（用于批量删除）
     */
    public static String sectorsCachePattern() {
        return SECTORS + "*";
    }

    /**
     * 生成板块详情缓存 key 模式（用于批量删除）
     */
    public static String sectorDetailCachePattern() {
        return SECTOR_DETAIL + "*";
    }
}
