package com.freetrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 板块详情 DTO
 * 用于返回板块详细信息，替代 Map<String, Object> 以提供类型安全
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectorDetailDTO {

    /** 板块ID */
    private Integer id;

    /** 板块名称 */
    private String name;

    /** 板块描述 */
    private String description;

    /** 板块下基金数量 */
    private Integer fundsCount;

    /** 是否已收藏 */
    private Boolean isFavorite;

    /** 板块下表现最好的ETF列表 */
    private List<EtfDTO> funds;
}
