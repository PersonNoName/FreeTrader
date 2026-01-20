package com.freetrader.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * 安全工具类
 * 提供获取当前用户信息的公共方法
 */
public final class SecurityUtils {

    private SecurityUtils() {
        // 工具类禁止实例化
    }

    /**
     * 获取当前认证用户的用户名
     *
     * @return 用户名，未认证时返回 empty
     */
    public static Optional<String> getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()
                && !SecurityConstants.ANONYMOUS_USER.equals(auth.getPrincipal())) {
            return Optional.ofNullable(auth.getName());
        }
        return Optional.empty();
    }

    /**
     * 判断当前请求是否已认证
     *
     * @return true-已认证，false-未认证/匿名
     */
    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated()
                && !SecurityConstants.ANONYMOUS_USER.equals(auth.getPrincipal());
    }
}
