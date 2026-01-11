package com.freetrader.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_collection")
public class UserCollection {
    
    @TableId(value = "collect_id", type = IdType.AUTO)
    private Integer collectId;
    
    private Integer userId;
    
    private Integer cid;
    
    private LocalDateTime collectTime;
}
