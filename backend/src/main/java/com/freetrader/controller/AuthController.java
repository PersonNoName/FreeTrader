package com.freetrader.controller;

import com.freetrader.dto.*;
import com.freetrader.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public Result<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    @PostMapping("/register")
    public Result<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(400, e.getMessage());
        }
    }
}
