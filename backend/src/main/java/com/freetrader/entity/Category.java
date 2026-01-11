package com.freetrader.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("category")
public class Category {
    
    @TableId(value = "cid", type = IdType.AUTO)
    private Integer cid;
    
    private String name;
    
    private String description;
    
    private Integer sortOrder;
    
    private Integer status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Integer itemCount;
    
    // Non-persistent fields for calculated values
    @TableField(exist = false)
    private Double avgChange;
    
    @TableField(exist = false)
    private Double price;
    
    @TableField(exist = false)
    private String marketCap;
    
    @TableField(exist = false)
    private Boolean isFavorite;
}
