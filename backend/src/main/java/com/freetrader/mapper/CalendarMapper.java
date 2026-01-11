package com.freetrader.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.freetrader.entity.Calendar;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CalendarMapper extends BaseMapper<Calendar> {
    
    /**
     * Get the last N trading days up to and including today
     */
    @Select("""
        SELECT Day FROM calendar 
        WHERE IsTradingDay = 1 AND Day <= #{today}
        ORDER BY Day DESC 
        LIMIT #{n}
    """)
    List<String> findLastNTradingDays(@Param("today") String today, @Param("n") int n);
}
