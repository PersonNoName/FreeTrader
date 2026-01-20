package com.freetrader.security;

import com.freetrader.util.SecurityConstants;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import jakarta.annotation.PostConstruct;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT 工具类
 * 提供 Token 生成、解析、验证等功能
 */
@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    /** 最小密钥长度（字节） */
    private static final int MIN_SECRET_KEY_LENGTH = 32;

    /**
     * 启动时验证密钥长度
     * 如果密钥长度不足，抛出异常而非静默填充
     */
    @PostConstruct
    public void validateSecretKey() {
        if (secret == null || secret.getBytes().length < MIN_SECRET_KEY_LENGTH) {
            throw new IllegalStateException(
                    String.format("JWT secret key must be at least %d bytes. " +
                            "Current length: %d bytes. Please set a secure JWT_SECRET environment variable.",
                            MIN_SECRET_KEY_LENGTH,
                            secret == null ? 0 : secret.getBytes().length));
        }
    }

    /**
     * 获取签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 从 Token 中提取用户名
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * 从 Token 中提取过期时间
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * 从 Token 中提取 Token 类型
     */
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get(SecurityConstants.TOKEN_TYPE_CLAIM, String.class));
    }

    /**
     * 通用声明提取方法
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 提取所有声明
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 检查 Token 是否过期
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * 生成 Access Token
     */
    public String generateAccessToken(UserDetails userDetails) {
        return generateAccessToken(userDetails.getUsername());
    }

    /**
     * 生成 Access Token
     */
    public String generateAccessToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(SecurityConstants.TOKEN_TYPE_CLAIM, SecurityConstants.ACCESS_TOKEN_TYPE);
        return createToken(claims, username, accessTokenExpiration);
    }

    /**
     * 生成 Refresh Token
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(SecurityConstants.TOKEN_TYPE_CLAIM, SecurityConstants.REFRESH_TOKEN_TYPE);
        return createToken(claims, username, refreshTokenExpiration);
    }

    /**
     * 创建 Token
     */
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 验证 Token（带用户信息）
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * 验证 Token（仅检查有效性）
     */
    public Boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token验证失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 检查是否为 Access Token
     */
    public Boolean isAccessToken(String token) {
        try {
            String type = extractTokenType(token);
            return SecurityConstants.ACCESS_TOKEN_TYPE.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查是否为 Refresh Token
     */
    public Boolean isRefreshToken(String token) {
        try {
            String type = extractTokenType(token);
            return SecurityConstants.REFRESH_TOKEN_TYPE.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 获取 Access Token 过期时间（毫秒）
     */
    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    /**
     * 获取 Refresh Token 过期时间（毫秒）
     */
    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}
