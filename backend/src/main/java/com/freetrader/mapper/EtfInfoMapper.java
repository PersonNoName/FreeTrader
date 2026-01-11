package com.freetrader.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.freetrader.dto.EtfDTO;
import com.freetrader.entity.EtfInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface EtfInfoMapper extends BaseMapper<EtfInfo> {
    
    /**
     * Get top N ETFs by performance for a specific sector
     */
    @Select("""
        SELECT 
            e.ths_code as name,
            e.chinese_name as fullName,
            COALESCE(latest.net_asset_value, 0) as price,
            COALESCE(
                CASE 
                    WHEN earliest.adjusted_nav > 0 
                    THEN latest.adjusted_nav - earliest.adjusted_nav 
                    ELSE 0 
                END, 
                0
            ) as returns,
            COALESCE(
                CASE 
                    WHEN earliest.adjusted_nav > 0 
                    THEN (latest.adjusted_nav - earliest.adjusted_nav) / earliest.adjusted_nav * 100 
                    ELSE 0 
                END, 
                0
            ) as returnsPercent
        FROM etf_info e
        LEFT JOIN etf_netasset latest ON latest.ths_code = e.ths_code AND latest.time = #{latestDay}
        LEFT JOIN etf_netasset earliest ON earliest.ths_code = e.ths_code AND earliest.time = #{earliestDay}
        WHERE e.sector = #{sectorName}
        ORDER BY returnsPercent DESC
        LIMIT #{topN}
    """)
    List<EtfDTO> findTopEtfsBySector(
            @Param("sectorName") String sectorName,
            @Param("latestDay") String latestDay,
            @Param("earliestDay") String earliestDay,
            @Param("topN") int topN
    );
}
