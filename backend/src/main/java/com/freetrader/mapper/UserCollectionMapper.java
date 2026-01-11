package com.freetrader.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.freetrader.entity.UserCollection;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserCollectionMapper extends BaseMapper<UserCollection> {
    
    /**
     * Get all favorite category IDs for a user
     */
    @Select("SELECT cid FROM user_collection WHERE user_id = #{userId}")
    List<Integer> findFavoriteCidsByUserId(@Param("userId") Integer userId);
}
