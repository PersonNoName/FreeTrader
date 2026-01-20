package com.freetrader.controller;

import com.freetrader.dto.Result;
import com.freetrader.dto.SectorDTO;
import com.freetrader.dto.SectorDetailDTO;
import com.freetrader.entity.User;
import com.freetrader.service.SectorService;
import com.freetrader.service.UserService;
import com.freetrader.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "板块管理", description = "ETF板块数据查询接口")
@RestController
@RequestMapping("/api/sectors")
@RequiredArgsConstructor
public class SectorController {

    private final SectorService sectorService;
    private final UserService userService;

    private Integer getCurrentUserId() {
        return SecurityUtils.getCurrentUsername()
                .map(username -> {
                    User user = userService.findByUsername(username);
                    return user != null ? user.getId() : null;
                })
                .orElse(null);
    }

    @Operation(summary = "获取所有板块", description = "获取所有ETF板块列表，包含平均涨跌幅、走势等信息")
    @ApiResponse(responseCode = "200", description = "获取成功")
    @GetMapping
    public Result<List<SectorDTO>> getAllSectors() {
        Integer userId = getCurrentUserId();
        List<SectorDTO> sectors = sectorService.getAllSectors(userId);
        return Result.success(sectors);
    }

    @Operation(summary = "获取板块详情", description = "获取指定板块的详细信息，包含旗下表现最好的ETF列表")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "板块不存在")
    })
    @GetMapping("/{id}")
    public Result<SectorDetailDTO> getSectorDetail(
            @Parameter(description = "板块ID") @PathVariable Integer id) {
        Integer userId = getCurrentUserId();
        SectorDetailDTO detail = sectorService.getSectorDetail(id, userId);
        return Result.success(detail);
    }
}
