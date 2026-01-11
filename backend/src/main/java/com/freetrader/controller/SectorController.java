package com.freetrader.controller;

import com.freetrader.dto.Result;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.User;
import com.freetrader.service.SectorService;
import com.freetrader.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sectors")
@RequiredArgsConstructor
public class SectorController {

    private final SectorService sectorService;
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
        return null;
    }

    /**
     * Get all sectors with average performance
     */
    @GetMapping
    public Result<List<SectorDTO>> getAllSectors() {
        try {
            Integer userId = getCurrentUserId();
            List<SectorDTO> sectors = sectorService.getAllSectors(userId);
            return Result.success(sectors);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * Get sector detail with top funds
     */
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getSectorDetail(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            Map<String, Object> detail = sectorService.getSectorDetail(id, userId);
            return Result.success(detail);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
