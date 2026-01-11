package com.freetrader.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.freetrader.dto.AuthResponse;
import com.freetrader.dto.LoginRequest;
import com.freetrader.dto.RegisterRequest;
import com.freetrader.entity.User;
import com.freetrader.mapper.UserMapper;
import com.freetrader.security.JwtUtils;
import com.freetrader.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // Check if username exists
        if (userMapper.selectCount(new QueryWrapper<User>().eq("username", request.getUsername())) > 0) {
            throw new RuntimeException("用户名已存在");
        }

        // Check if email exists
        if (userMapper.selectCount(new QueryWrapper<User>().eq("email", request.getEmail())) > 0) {
            throw new RuntimeException("邮箱已被注册");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userMapper.insert(user);

        // Generate token
        String token = jwtUtils.generateToken(user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userMapper.selectOne(
                new QueryWrapper<User>().eq("username", request.getUsername()).isNull("deleted_at"));

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtils.generateToken(user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }

    public User findByUsername(String username) {
        return userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username).isNull("deleted_at"));
    }
}
