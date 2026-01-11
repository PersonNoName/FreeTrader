package com.freetrader.controller;

import com.freetrader.dto.Result;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.User;
import com.freetrader.service.FavoriteService;
import com.freetrader.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    /**
     * Get current user ID from security context
     */
    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String username = auth.getName();
            User user = userService.findByUsername(username);
            return user != null ? user.getId() : null;
        }
        throw new RuntimeException("用户未登录");
    }

    /**
     * Get all favorite sectors for current user
     */
    @GetMapping
    public Result<List<SectorDTO>> getFavorites() {
        try {
            Integer userId = getCurrentUserId();
            List<SectorDTO> favorites = favoriteService.getFavoriteSectors(userId);
            return Result.success(favorites);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * Add sector to favorites
     */
    @PostMapping("/{cid}")
    public Result<Void> addFavorite(@PathVariable Integer cid) {
        try {
            Integer userId = getCurrentUserId();
            favoriteService.addFavorite(userId, cid);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * Remove sector from favorites
     */
    @DeleteMapping("/{cid}")
    public Result<Void> removeFavorite(@PathVariable Integer cid) {
        try {
            Integer userId = getCurrentUserId();
            favoriteService.removeFavorite(userId, cid);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * Toggle sector favorite status
     */
    @PostMapping("/{cid}/toggle")
    public Result<Map<String, Boolean>> toggleFavorite(@PathVariable Integer cid) {
        try {
            Integer userId = getCurrentUserId();
            boolean isFavorite = favoriteService.toggleFavorite(userId, cid);
            return Result.success(Map.of("isFavorite", isFavorite));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
