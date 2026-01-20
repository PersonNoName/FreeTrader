package com.freetrader.annotation;

import java.lang.annotation.*;

/**
 * 接口限流注解
 * 用于限制接口的访问频率，防止恶意刷接口
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /**
     * 限流时间窗口（秒）
     * 默认 60 秒
     */
    int window() default 60;

    /**
     * 时间窗口内最大请求次数
     * 默认 10 次
     */
    int maxRequests() default 10;

    /**
     * 限流 key 前缀
     * 默认为空，使用方法名作为 key
     */
    String prefix() default "";

    /**
     * 限流类型
     * IP - 按 IP 限流
     * USER - 按用户限流
     * GLOBAL - 全局限流
     */
    LimitType limitType() default LimitType.IP;

    enum LimitType {
        /** 按 IP 地址限流 */
        IP,
        /** 按用户限流（需要登录） */
        USER,
        /** 全局限流 */
        GLOBAL
    }
}
