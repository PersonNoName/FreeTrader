package com.freetrader.controller;

import com.freetrader.annotation.RateLimit;
import com.freetrader.dto.*;
import com.freetrader.service.TokenService;
import com.freetrader.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "认证管理", description = "用户登录、注册、Token刷新等接口")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final TokenService tokenService;

    @Operation(summary = "用户登录", description = "通过用户名和密码登录系统，返回 Access Token 和 Refresh Token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "登录成功",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "用户名或密码错误")
    })
    @RateLimit(window = 60, maxRequests = 5, prefix = "login", limitType = RateLimit.LimitType.IP)
    @PostMapping("/login")
    public Result<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return Result.success(response);
    }

    @Operation(summary = "用户注册", description = "创建新用户账号，注册成功后自动登录")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "注册成功"),
            @ApiResponse(responseCode = "400", description = "用户名或邮箱已存在")
    })
    @RateLimit(window = 60, maxRequests = 3, prefix = "register", limitType = RateLimit.LimitType.IP)
    @PostMapping("/register")
    public Result<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return Result.success(response);
    }

    @Operation(summary = "刷新Token", description = "使用 Refresh Token 获取新的 Access Token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "刷新成功"),
            @ApiResponse(responseCode = "401", description = "Refresh Token 无效或已过期")
    })
    @PostMapping("/refresh")
    public Result<Map<String, String>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String newAccessToken = tokenService.refreshAccessToken(request.getRefreshToken());
        return Result.success(Map.of("accessToken", newAccessToken));
    }

    @Operation(summary = "用户登出", description = "注销当前用户的 Token，将其加入黑名单")
    @ApiResponse(responseCode = "200", description = "登出成功")
    @PostMapping("/logout")
    public Result<Void> logout(@RequestBody LogoutRequest request) {
        tokenService.logout(request.getAccessToken(), request.getRefreshToken());
        return Result.success();
    }
}
