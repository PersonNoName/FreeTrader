package com.freetrader.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.freetrader.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
