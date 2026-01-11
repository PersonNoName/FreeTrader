package com.freetrader.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.freetrader.dto.SectorDTO;
import com.freetrader.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
    
    /**
     * Get all sectors with average change calculated from ETF performance
     * over the specified trading day range
     */
    @Select("""
        SELECT 
            c.cid as id,
            c.name,
            c.description,
            c.item_count as fundsCount,
            COALESCE(
                AVG(
                    CASE 
                        WHEN earliest.adjusted_nav > 0 
                        THEN (latest.adjusted_nav - earliest.adjusted_nav) / earliest.adjusted_nav * 100 
                        ELSE 0 
                    END
                ), 
                0
            ) as avgChange
        FROM category c
        LEFT JOIN etf_info e ON e.sector = c.name
        LEFT JOIN etf_netasset latest ON latest.ths_code = e.ths_code AND latest.time = #{latestDay}
        LEFT JOIN etf_netasset earliest ON earliest.ths_code = e.ths_code AND earliest.time = #{earliestDay}
        WHERE c.status = 1
        GROUP BY c.cid, c.name, c.description, c.item_count
        ORDER BY c.sort_order DESC
    """)
    List<SectorDTO> findAllSectorsWithAvgChange(
            @Param("latestDay") String latestDay,
            @Param("earliestDay") String earliestDay
    );
}
