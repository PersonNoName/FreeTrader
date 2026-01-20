package com.freetrader.service;

import com.freetrader.exception.BusinessException;
import com.freetrader.exception.ErrorCode;
import com.freetrader.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtUtils jwtUtils;
    private final CacheService cacheService;

    public String refreshAccessToken(String refreshToken) {
        if (!jwtUtils.validateToken(refreshToken)) {
            log.warn("刷新Token无效或已过期");
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        if (!jwtUtils.isRefreshToken(refreshToken)) {
            log.warn("提供的Token类型不是刷新Token");
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        if (cacheService.isTokenBlacklisted(refreshToken)) {
            log.warn("刷新Token已被加入黑名单");
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        String username = jwtUtils.extractUsername(refreshToken);
        String newAccessToken = jwtUtils.generateAccessToken(username);
        
        log.info("为用户 {} 刷新访问Token成功", username);
        return newAccessToken;
    }

    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null && jwtUtils.validateToken(accessToken)) {
            long accessExpiration = jwtUtils.getAccessTokenExpiration();
            cacheService.addToTokenBlacklist(accessToken, accessExpiration);
            log.debug("AccessToken已加入黑名单");
        }

        if (refreshToken != null && jwtUtils.validateToken(refreshToken)) {
            long refreshExpiration = jwtUtils.getRefreshTokenExpiration();
            cacheService.addToTokenBlacklist(refreshToken, refreshExpiration);
            log.debug("RefreshToken已加入黑名单");
        }

        log.info("用户登出成功");
    }

    public boolean isTokenValid(String token) {
        if (token == null || !jwtUtils.validateToken(token)) {
            return false;
        }
        return !cacheService.isTokenBlacklisted(token);
    }
}
