package com.freetrader.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("etf_netasset")
public class EtfNetAsset {
    
    private String thsCode;
    
    private LocalDate time;
    
    private Float netAssetValue;
    
    private Float adjustedNav;
    
    private Float accumulatedNav;
    
    private Float premium;
    
    private Float premiumRatio;
}
