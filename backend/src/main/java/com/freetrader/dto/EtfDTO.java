package com.freetrader.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtfDTO {
    private String name;           // ths_code (代码)
    private String fullName;       // chinese_name (中文名称)
    private Double price;          // net_asset_value (净值)
    private Double fcfShare;       // Placeholder
    private String mktCap;         // Placeholder (市值)
    private Double returns;        // Price change amount
    private Double returnsPercent; // Percentage change (涨跌幅)
    private String icon;           // First letter of name
    private String iconBg;         // Background color class
    private String iconColor;      // Text color class
    private Boolean isFavorite;    // User favorite status
}
