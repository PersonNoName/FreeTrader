package com.freetrader.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.freetrader.dto.AuthResponse;
import com.freetrader.dto.LoginRequest;
import com.freetrader.dto.RegisterRequest;
import com.freetrader.entity.User;
import com.freetrader.exception.BusinessException;
import com.freetrader.exception.ErrorCode;
import com.freetrader.mapper.UserMapper;
import com.freetrader.security.JwtUtils;
import com.freetrader.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username).isNull("deleted_at"));
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }
        return UserDetailsImpl.build(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("用户注册: {}", request.getUsername());
        
        if (userMapper.selectCount(new QueryWrapper<User>().eq("username", request.getUsername())) > 0) {
            throw new BusinessException(ErrorCode.USERNAME_EXISTS);
        }

        if (userMapper.selectCount(new QueryWrapper<User>().eq("email", request.getEmail())) > 0) {
            throw new BusinessException(ErrorCode.EMAIL_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userMapper.insert(user);
        log.info("用户注册成功: userId={}", user.getId());

        String accessToken = jwtUtils.generateAccessToken(user.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("用户登录: {}", request.getUsername());
        
        User user = userMapper.selectOne(
                new QueryWrapper<User>().eq("username", request.getUsername()).isNull("deleted_at"));

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("登录失败: 用户名或密码错误 - {}", request.getUsername());
            throw new BusinessException(ErrorCode.PASSWORD_ERROR);
        }

        String accessToken = jwtUtils.generateAccessToken(user.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());
        
        log.info("用户登录成功: userId={}", user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public User findByUsername(String username) {
        return userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username).isNull("deleted_at"));
    }
}
