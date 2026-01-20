package com.freetrader.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * JwtUtils 单元测试
 */
@DisplayName("JwtUtils 单元测试")
class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private UserDetails testUserDetails;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // 设置测试配置
        ReflectionTestUtils.setField(jwtUtils, "secret", "test-secret-key-for-jwt-testing-min-32-bytes-long");
        ReflectionTestUtils.setField(jwtUtils, "accessTokenExpiration", 3600000L); // 1 hour
        ReflectionTestUtils.setField(jwtUtils, "refreshTokenExpiration", 604800000L); // 7 days

        testUserDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();
    }

    @Nested
    @DisplayName("Token 生成测试")
    class TokenGenerationTests {

        @Test
        @DisplayName("生成 Access Token - 使用 UserDetails")
        void generateAccessToken_WithUserDetails_ShouldReturnValidToken() {
            // When
            String token = jwtUtils.generateAccessToken(testUserDetails);

            // Then
            assertThat(token).isNotNull().isNotEmpty();
            assertThat(jwtUtils.extractUsername(token)).isEqualTo("testuser");
            assertThat(jwtUtils.isAccessToken(token)).isTrue();
            assertThat(jwtUtils.isRefreshToken(token)).isFalse();
        }

        @Test
        @DisplayName("生成 Access Token - 使用用户名")
        void generateAccessToken_WithUsername_ShouldReturnValidToken() {
            // When
            String token = jwtUtils.generateAccessToken("testuser");

            // Then
            assertThat(token).isNotNull().isNotEmpty();
            assertThat(jwtUtils.extractUsername(token)).isEqualTo("testuser");
            assertThat(jwtUtils.isAccessToken(token)).isTrue();
        }

        @Test
        @DisplayName("生成 Refresh Token")
        void generateRefreshToken_ShouldReturnValidToken() {
            // When
            String token = jwtUtils.generateRefreshToken("testuser");

            // Then
            assertThat(token).isNotNull().isNotEmpty();
            assertThat(jwtUtils.extractUsername(token)).isEqualTo("testuser");
            assertThat(jwtUtils.isRefreshToken(token)).isTrue();
            assertThat(jwtUtils.isAccessToken(token)).isFalse();
        }

        @Test
        @DisplayName("Access Token 和 Refresh Token 应该不同")
        void generateTokens_ShouldProduceDifferentTokens() {
            // When
            String accessToken = jwtUtils.generateAccessToken("testuser");
            String refreshToken = jwtUtils.generateRefreshToken("testuser");

            // Then
            assertThat(accessToken).isNotEqualTo(refreshToken);
        }
    }

    @Nested
    @DisplayName("Token 提取测试")
    class TokenExtractionTests {

        @Test
        @DisplayName("提取用户名")
        void extractUsername_ShouldReturnCorrectUsername() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When
            String username = jwtUtils.extractUsername(token);

            // Then
            assertThat(username).isEqualTo("testuser");
        }

        @Test
        @DisplayName("提取过期时间")
        void extractExpiration_ShouldReturnFutureDate() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When
            Date expiration = jwtUtils.extractExpiration(token);

            // Then
            assertThat(expiration).isAfter(new Date());
        }

        @Test
        @DisplayName("提取 Token 类型 - Access Token")
        void extractTokenType_FromAccessToken_ShouldReturnAccess() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When
            String tokenType = jwtUtils.extractTokenType(token);

            // Then
            assertThat(tokenType).isEqualTo("access");
        }

        @Test
        @DisplayName("提取 Token 类型 - Refresh Token")
        void extractTokenType_FromRefreshToken_ShouldReturnRefresh() {
            // Given
            String token = jwtUtils.generateRefreshToken("testuser");

            // When
            String tokenType = jwtUtils.extractTokenType(token);

            // Then
            assertThat(tokenType).isEqualTo("refresh");
        }
    }

    @Nested
    @DisplayName("Token 验证测试")
    class TokenValidationTests {

        @Test
        @DisplayName("验证有效的 Token - 带 UserDetails")
        void validateToken_WithValidTokenAndUserDetails_ShouldReturnTrue() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When
            Boolean isValid = jwtUtils.validateToken(token, testUserDetails);

            // Then
            assertThat(isValid).isTrue();
        }

        @Test
        @DisplayName("验证有效的 Token - 不带 UserDetails")
        void validateToken_WithValidToken_ShouldReturnTrue() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When
            Boolean isValid = jwtUtils.validateToken(token);

            // Then
            assertThat(isValid).isTrue();
        }

        @Test
        @DisplayName("验证失败 - 用户名不匹配")
        void validateToken_WithDifferentUsername_ShouldReturnFalse() {
            // Given
            String token = jwtUtils.generateAccessToken("otheruser");

            // When
            Boolean isValid = jwtUtils.validateToken(token, testUserDetails);

            // Then
            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("验证失败 - 无效的 Token 格式")
        void validateToken_WithInvalidFormat_ShouldReturnFalse() {
            // Given
            String invalidToken = "invalid.token.format";

            // When
            Boolean isValid = jwtUtils.validateToken(invalidToken);

            // Then
            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("验证失败 - 过期的 Token")
        void validateToken_WithExpiredToken_ShouldReturnFalse() {
            // Given - 设置很短的过期时间
            ReflectionTestUtils.setField(jwtUtils, "accessTokenExpiration", -1000L); // 已过期
            String expiredToken = jwtUtils.generateAccessToken("testuser");

            // When
            Boolean isValid = jwtUtils.validateToken(expiredToken);

            // Then
            assertThat(isValid).isFalse();
        }
    }

    @Nested
    @DisplayName("Token 类型判断测试")
    class TokenTypeTests {

        @Test
        @DisplayName("isAccessToken - Access Token 返回 true")
        void isAccessToken_WithAccessToken_ShouldReturnTrue() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When & Then
            assertThat(jwtUtils.isAccessToken(token)).isTrue();
        }

        @Test
        @DisplayName("isAccessToken - Refresh Token 返回 false")
        void isAccessToken_WithRefreshToken_ShouldReturnFalse() {
            // Given
            String token = jwtUtils.generateRefreshToken("testuser");

            // When & Then
            assertThat(jwtUtils.isAccessToken(token)).isFalse();
        }

        @Test
        @DisplayName("isRefreshToken - Refresh Token 返回 true")
        void isRefreshToken_WithRefreshToken_ShouldReturnTrue() {
            // Given
            String token = jwtUtils.generateRefreshToken("testuser");

            // When & Then
            assertThat(jwtUtils.isRefreshToken(token)).isTrue();
        }

        @Test
        @DisplayName("isRefreshToken - Access Token 返回 false")
        void isRefreshToken_WithAccessToken_ShouldReturnFalse() {
            // Given
            String token = jwtUtils.generateAccessToken("testuser");

            // When & Then
            assertThat(jwtUtils.isRefreshToken(token)).isFalse();
        }

        @Test
        @DisplayName("isAccessToken - 无效 Token 返回 false")
        void isAccessToken_WithInvalidToken_ShouldReturnFalse() {
            // Given
            String invalidToken = "invalid-token";

            // When & Then
            assertThat(jwtUtils.isAccessToken(invalidToken)).isFalse();
        }
    }

    @Nested
    @DisplayName("过期时间配置测试")
    class ExpirationConfigTests {

        @Test
        @DisplayName("获取 Access Token 过期时间")
        void getAccessTokenExpiration_ShouldReturnConfiguredValue() {
            // When
            long expiration = jwtUtils.getAccessTokenExpiration();

            // Then
            assertThat(expiration).isEqualTo(3600000L);
        }

        @Test
        @DisplayName("获取 Refresh Token 过期时间")
        void getRefreshTokenExpiration_ShouldReturnConfiguredValue() {
            // When
            long expiration = jwtUtils.getRefreshTokenExpiration();

            // Then
            assertThat(expiration).isEqualTo(604800000L);
        }
    }
}
