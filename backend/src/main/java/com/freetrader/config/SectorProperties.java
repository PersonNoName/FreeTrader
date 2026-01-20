package com.freetrader.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 板块相关配置常量
 * 通过 application.yml 进行配置，避免硬编码
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.sector")
public class SectorProperties {

    /**
     * 趋势图基准值
     */
    private double trendBaseValue = 10.0;

    /**
     * 趋势图方向因子（正值表示上涨趋势，负值表示下跌）
     */
    private double trendDirectionFactor = 0.3;

    /**
     * 趋势图数据点数量
     */
    private int trendDataPoints = 7;

    /**
     * 趋势波动范围
     */
    private double trendVolatility = 2.0;
}
