package com.freetrader.service;

import com.freetrader.exception.BusinessException;
import com.freetrader.security.JwtUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

/**
 * TokenService 单元测试
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TokenService 单元测试")
class TokenServiceTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private CacheService cacheService;

    @InjectMocks
    private TokenService tokenService;

    @Nested
    @DisplayName("刷新 Token 测试")
    class RefreshAccessTokenTests {

        @Test
        @DisplayName("刷新成功 - 有效的 Refresh Token")
        void refreshAccessToken_WithValidToken_ShouldReturnNewAccessToken() {
            // Given
            String refreshToken = "valid-refresh-token";
            String expectedAccessToken = "new-access-token";

            when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
            when(jwtUtils.isRefreshToken(refreshToken)).thenReturn(true);
            when(cacheService.isTokenBlacklisted(refreshToken)).thenReturn(false);
            when(jwtUtils.extractUsername(refreshToken)).thenReturn("testuser");
            when(jwtUtils.generateAccessToken("testuser")).thenReturn(expectedAccessToken);

            // When
            String result = tokenService.refreshAccessToken(refreshToken);

            // Then
            assertThat(result).isEqualTo(expectedAccessToken);
            verify(jwtUtils).validateToken(refreshToken);
            verify(jwtUtils).isRefreshToken(refreshToken);
            verify(cacheService).isTokenBlacklisted(refreshToken);
        }

        @Test
        @DisplayName("刷新失败 - Token 无效")
        void refreshAccessToken_WithInvalidToken_ShouldThrowException() {
            // Given
            String invalidToken = "invalid-token";
            when(jwtUtils.validateToken(invalidToken)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> tokenService.refreshAccessToken(invalidToken))
                    .isInstanceOf(BusinessException.class);

            verify(jwtUtils, never()).extractUsername(anyString());
        }

        @Test
        @DisplayName("刷新失败 - 不是 Refresh Token")
        void refreshAccessToken_WithAccessToken_ShouldThrowException() {
            // Given
            String accessToken = "access-token";
            when(jwtUtils.validateToken(accessToken)).thenReturn(true);
            when(jwtUtils.isRefreshToken(accessToken)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> tokenService.refreshAccessToken(accessToken))
                    .isInstanceOf(BusinessException.class);
        }

        @Test
        @DisplayName("刷新失败 - Token 在黑名单中")
        void refreshAccessToken_WithBlacklistedToken_ShouldThrowException() {
            // Given
            String blacklistedToken = "blacklisted-token";
            when(jwtUtils.validateToken(blacklistedToken)).thenReturn(true);
            when(jwtUtils.isRefreshToken(blacklistedToken)).thenReturn(true);
            when(cacheService.isTokenBlacklisted(blacklistedToken)).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> tokenService.refreshAccessToken(blacklistedToken))
                    .isInstanceOf(BusinessException.class);
        }
    }

    @Nested
    @DisplayName("登出测试")
    class LogoutTests {

        @Test
        @DisplayName("登出成功 - 两个 Token 都有效")
        void logout_WithBothTokens_ShouldAddBothToBlacklist() {
            // Given
            String accessToken = "valid-access-token";
            String refreshToken = "valid-refresh-token";

            when(jwtUtils.validateToken(accessToken)).thenReturn(true);
            when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
            when(jwtUtils.getAccessTokenExpiration()).thenReturn(3600000L);
            when(jwtUtils.getRefreshTokenExpiration()).thenReturn(604800000L);

            // When
            tokenService.logout(accessToken, refreshToken);

            // Then
            verify(cacheService).addToTokenBlacklist(accessToken, 3600000L);
            verify(cacheService).addToTokenBlacklist(refreshToken, 604800000L);
        }

        @Test
        @DisplayName("登出 - Access Token 为空")
        void logout_WithNullAccessToken_ShouldOnlyBlacklistRefreshToken() {
            // Given
            String refreshToken = "valid-refresh-token";

            when(jwtUtils.validateToken(refreshToken)).thenReturn(true);
            when(jwtUtils.getRefreshTokenExpiration()).thenReturn(604800000L);

            // When
            tokenService.logout(null, refreshToken);

            // Then
            verify(cacheService).addToTokenBlacklist(refreshToken, 604800000L);
            verify(cacheService, times(1)).addToTokenBlacklist(anyString(), anyLong());
        }

        @Test
        @DisplayName("登出 - 两个 Token 都无效")
        void logout_WithInvalidTokens_ShouldNotAddToBlacklist() {
            // Given
            String invalidAccessToken = "invalid-access";
            String invalidRefreshToken = "invalid-refresh";

            when(jwtUtils.validateToken(invalidAccessToken)).thenReturn(false);
            when(jwtUtils.validateToken(invalidRefreshToken)).thenReturn(false);

            // When
            tokenService.logout(invalidAccessToken, invalidRefreshToken);

            // Then
            verify(cacheService, never()).addToTokenBlacklist(anyString(), anyLong());
        }
    }

    @Nested
    @DisplayName("Token 有效性验证测试")
    class IsTokenValidTests {

        @Test
        @DisplayName("Token 有效 - 未过期且不在黑名单")
        void isTokenValid_WithValidToken_ShouldReturnTrue() {
            // Given
            String token = "valid-token";
            when(jwtUtils.validateToken(token)).thenReturn(true);
            when(cacheService.isTokenBlacklisted(token)).thenReturn(false);

            // When
            boolean result = tokenService.isTokenValid(token);

            // Then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("Token 无效 - 已过期")
        void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
            // Given
            String token = "expired-token";
            when(jwtUtils.validateToken(token)).thenReturn(false);

            // When
            boolean result = tokenService.isTokenValid(token);

            // Then
            assertThat(result).isFalse();
            verify(cacheService, never()).isTokenBlacklisted(anyString());
        }

        @Test
        @DisplayName("Token 无效 - 在黑名单中")
        void isTokenValid_WithBlacklistedToken_ShouldReturnFalse() {
            // Given
            String token = "blacklisted-token";
            when(jwtUtils.validateToken(token)).thenReturn(true);
            when(cacheService.isTokenBlacklisted(token)).thenReturn(true);

            // When
            boolean result = tokenService.isTokenValid(token);

            // Then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("Token 无效 - null")
        void isTokenValid_WithNullToken_ShouldReturnFalse() {
            // When
            boolean result = tokenService.isTokenValid(null);

            // Then
            assertThat(result).isFalse();
            verify(jwtUtils, never()).validateToken(anyString());
        }
    }
}
