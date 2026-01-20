package com.freetrader.controller;

import com.freetrader.dto.Result;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.User;
import com.freetrader.exception.BusinessException;
import com.freetrader.exception.ErrorCode;
import com.freetrader.service.FavoriteService;
import com.freetrader.service.UserService;
import com.freetrader.util.SecurityConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "收藏管理", description = "用户板块收藏管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !SecurityConstants.ANONYMOUS_USER.equals(auth.getPrincipal())) {
            String username = auth.getName();
            User user = userService.findByUsername(username);
            return user != null ? user.getId() : null;
        }
        throw new BusinessException(ErrorCode.USER_NOT_LOGIN);
    }

    @Operation(summary = "获取收藏列表", description = "获取当前用户收藏的所有板块")
    @ApiResponse(responseCode = "200", description = "获取成功")
    @GetMapping
    public Result<List<SectorDTO>> getFavorites() {
        Integer userId = getCurrentUserId();
        List<SectorDTO> favorites = favoriteService.getFavoriteSectors(userId);
        return Result.success(favorites);
    }

    @Operation(summary = "添加收藏", description = "收藏指定板块")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "收藏成功"),
            @ApiResponse(responseCode = "400", description = "已收藏该板块")
    })
    @PostMapping("/{cid}")
    public Result<Void> addFavorite(
            @Parameter(description = "板块ID") @PathVariable Integer cid) {
        Integer userId = getCurrentUserId();
        favoriteService.addFavorite(userId, cid);
        return Result.success();
    }

    @Operation(summary = "取消收藏", description = "取消收藏指定板块")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "取消成功"),
            @ApiResponse(responseCode = "400", description = "未收藏该板块")
    })
    @DeleteMapping("/{cid}")
    public Result<Void> removeFavorite(
            @Parameter(description = "板块ID") @PathVariable Integer cid) {
        Integer userId = getCurrentUserId();
        favoriteService.removeFavorite(userId, cid);
        return Result.success();
    }

    @Operation(summary = "切换收藏状态", description = "如果已收藏则取消，未收藏则添加")
    @ApiResponse(responseCode = "200", description = "操作成功，返回当前收藏状态")
    @PostMapping("/{cid}/toggle")
    public Result<Map<String, Boolean>> toggleFavorite(
            @Parameter(description = "板块ID") @PathVariable Integer cid) {
        Integer userId = getCurrentUserId();
        boolean isFavorite = favoriteService.toggleFavorite(userId, cid);
        return Result.success(Map.of("isFavorite", isFavorite));
    }
}
