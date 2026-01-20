package com.freetrader.util;

/**
 * 安全相关常量定义
 */
public final class SecurityConstants {

    private SecurityConstants() {
        // 工具类禁止实例化
    }

    /**
     * Spring Security 匿名用户标识
     */
    public static final String ANONYMOUS_USER = "anonymousUser";

    /**
     * JWT Token 前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * Authorization 请求头名称
     */
    public static final String AUTHORIZATION_HEADER = "Authorization";

    /**
     * Token 类型声明字段名
     */
    public static final String TOKEN_TYPE_CLAIM = "type";

    /**
     * Access Token 类型标识
     */
    public static final String ACCESS_TOKEN_TYPE = "access";

    /**
     * Refresh Token 类型标识
     */
    public static final String REFRESH_TOKEN_TYPE = "refresh";
}
