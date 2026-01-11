package com.freetrader.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("calendar")
public class Calendar {
    
    private String day;
    
    private Integer isTradingDay;
    
    private Integer isWorkingDay;
    
    private String comments;
    
    private Integer fetchHoliday;
    
    private String updateTime;
}
