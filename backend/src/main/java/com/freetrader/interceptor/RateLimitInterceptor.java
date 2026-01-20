package com.freetrader.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.freetrader.annotation.RateLimit;
import com.freetrader.dto.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.TimeUnit;

/**
 * 限流拦截器
 * 基于 Redis 实现滑动窗口限流
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String RATE_LIMIT_PREFIX = "rate_limit:";
    private static final int TOO_MANY_REQUESTS = 429;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RateLimit rateLimit = handlerMethod.getMethodAnnotation(RateLimit.class);
        if (rateLimit == null) {
            return true;
        }

        String key = buildRateLimitKey(request, handlerMethod, rateLimit);
        
        if (!tryAcquire(key, rateLimit.window(), rateLimit.maxRequests())) {
            log.warn("接口限流触发: key={}, window={}s, maxRequests={}", 
                    key, rateLimit.window(), rateLimit.maxRequests());
            
            response.setStatus(TOO_MANY_REQUESTS);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            
            Result<Void> result = Result.error(TOO_MANY_REQUESTS, "请求过于频繁，请稍后再试");
            response.getWriter().write(objectMapper.writeValueAsString(result));
            return false;
        }

        return true;
    }

    /**
     * 构建限流 key
     */
    private String buildRateLimitKey(HttpServletRequest request, HandlerMethod handlerMethod, RateLimit rateLimit) {
        StringBuilder key = new StringBuilder(RATE_LIMIT_PREFIX);
        
        // 添加前缀
        if (!rateLimit.prefix().isEmpty()) {
            key.append(rateLimit.prefix()).append(":");
        } else {
            key.append(handlerMethod.getMethod().getName()).append(":");
        }

        // 根据限流类型添加标识
        switch (rateLimit.limitType()) {
            case IP:
                key.append(getClientIp(request));
                break;
            case USER:
                key.append(getCurrentUsername());
                break;
            case GLOBAL:
                key.append("global");
                break;
        }

        return key.toString();
    }

    /**
     * 尝试获取令牌（滑动窗口计数器算法）
     */
    private boolean tryAcquire(String key, int windowSeconds, int maxRequests) {
        try {
            Long count = redisTemplate.opsForValue().increment(key);
            if (count == null) {
                return true;
            }
            
            if (count == 1) {
                // 第一次请求，设置过期时间
                redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
            }
            
            return count <= maxRequests;
        } catch (Exception e) {
            log.error("限流检查失败: key={}", key, e);
            // Redis 异常时放行，避免影响正常服务
            return true;
        }
    }

    /**
     * 获取客户端 IP
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 多个代理的情况，取第一个 IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }

    /**
     * 获取当前登录用户名
     */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "anonymous";
    }
}
