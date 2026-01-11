package com.freetrader.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectorDTO {
    private Integer id;
    private String name;
    private Double change;      // Average percentage change
    private Double price;       // Latest NAV
    private String marketCap;   // Placeholder
    private Boolean isFavorite;
    private Integer fundsCount;
    private String description;
    private List<Double> trend; // Historical data for sparklines
}
