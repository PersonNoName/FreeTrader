package com.freetrader.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("etf_info")
public class EtfInfo {
    
    @TableId(value = "ths_code")
    private String thsCode;
    
    private String chineseName;
    
    private LocalDate startDay;
    
    private LocalDate endDay;
    
    private String sector;
}
