package com.freetrader.service;

import com.freetrader.dto.AuthResponse;
import com.freetrader.dto.LoginRequest;
import com.freetrader.dto.RegisterRequest;
import com.freetrader.entity.User;
import com.freetrader.exception.BusinessException;
import com.freetrader.mapper.UserMapper;
import com.freetrader.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * UserService 单元测试
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService 单元测试")
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$encodedPassword");
    }

    @Nested
    @DisplayName("用户登录测试")
    class LoginTests {

        @Test
        @DisplayName("登录成功 - 正确的用户名和密码")
        void login_WithValidCredentials_ShouldReturnAuthResponse() {
            // Given
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("password123");

            when(userMapper.selectOne(any())).thenReturn(testUser);
            when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
            when(jwtUtils.generateAccessToken("testuser")).thenReturn("access-token");
            when(jwtUtils.generateRefreshToken("testuser")).thenReturn("refresh-token");

            // When
            AuthResponse response = userService.login(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("access-token");
            assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
            assertThat(response.getUserId()).isEqualTo(1);
            assertThat(response.getUsername()).isEqualTo("testuser");

            verify(userMapper).selectOne(any());
            verify(passwordEncoder).matches("password123", testUser.getPassword());
        }

        @Test
        @DisplayName("登录失败 - 用户不存在")
        void login_WithNonExistentUser_ShouldThrowException() {
            // Given
            LoginRequest request = new LoginRequest();
            request.setUsername("nonexistent");
            request.setPassword("password123");

            when(userMapper.selectOne(any())).thenReturn(null);

            // When & Then
            assertThatThrownBy(() -> userService.login(request))
                    .isInstanceOf(BusinessException.class);

            verify(userMapper).selectOne(any());
            verify(passwordEncoder, never()).matches(anyString(), anyString());
        }

        @Test
        @DisplayName("登录失败 - 密码错误")
        void login_WithWrongPassword_ShouldThrowException() {
            // Given
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("wrongpassword");

            when(userMapper.selectOne(any())).thenReturn(testUser);
            when(passwordEncoder.matches("wrongpassword", testUser.getPassword())).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> userService.login(request))
                    .isInstanceOf(BusinessException.class);

            verify(jwtUtils, never()).generateAccessToken(anyString());
        }
    }

    @Nested
    @DisplayName("用户注册测试")
    class RegisterTests {

        @Test
        @DisplayName("注册成功 - 有效的注册信息")
        void register_WithValidRequest_ShouldReturnAuthResponse() {
            // Given
            RegisterRequest request = new RegisterRequest();
            request.setUsername("newuser");
            request.setEmail("newuser@example.com");
            request.setPassword("password123");

            when(userMapper.selectCount(any())).thenReturn(0L);
            when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedNewPassword");
            when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(2);
                return 1;
            });
            when(jwtUtils.generateAccessToken("newuser")).thenReturn("access-token");
            when(jwtUtils.generateRefreshToken("newuser")).thenReturn("refresh-token");

            // When
            AuthResponse response = userService.register(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("access-token");
            assertThat(response.getUsername()).isEqualTo("newuser");
            assertThat(response.getEmail()).isEqualTo("newuser@example.com");

            verify(userMapper, times(2)).selectCount(any());
            verify(userMapper).insert(any(User.class));
            verify(passwordEncoder).encode("password123");
        }

        @Test
        @DisplayName("注册失败 - 用户名已存在")
        void register_WithExistingUsername_ShouldThrowException() {
            // Given
            RegisterRequest request = new RegisterRequest();
            request.setUsername("existinguser");
            request.setEmail("new@example.com");
            request.setPassword("password123");

            when(userMapper.selectCount(any())).thenReturn(1L);

            // When & Then
            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(BusinessException.class);

            verify(userMapper, never()).insert(any());
        }
    }

    @Nested
    @DisplayName("根据用户名查找用户测试")
    class FindByUsernameTests {

        @Test
        @DisplayName("查找成功 - 用户存在")
        void findByUsername_WithExistingUser_ShouldReturnUser() {
            // Given
            when(userMapper.selectOne(any())).thenReturn(testUser);

            // When
            User result = userService.findByUsername("testuser");

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo("testuser");
        }

        @Test
        @DisplayName("查找失败 - 用户不存在")
        void findByUsername_WithNonExistentUser_ShouldReturnNull() {
            // Given
            when(userMapper.selectOne(any())).thenReturn(null);

            // When
            User result = userService.findByUsername("nonexistent");

            // Then
            assertThat(result).isNull();
        }
    }
}
