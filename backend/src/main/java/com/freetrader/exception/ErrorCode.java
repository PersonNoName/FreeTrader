package com.freetrader.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 通用错误 (1xxx)
    INTERNAL_ERROR(1000, "系统内部错误"),
    PARAM_INVALID(1001, "参数校验失败"),
    
    // 认证错误 (2xxx)
    UNAUTHORIZED(2001, "未授权访问"),
    TOKEN_INVALID(2002, "Token无效"),
    TOKEN_EXPIRED(2003, "Token已过期"),
    REFRESH_TOKEN_INVALID(2004, "刷新Token无效"),
    USER_NOT_LOGIN(2005, "用户未登录"),
    
    // 用户错误 (3xxx)
    USER_NOT_FOUND(3001, "用户不存在"),
    USERNAME_EXISTS(3002, "用户名已存在"),
    EMAIL_EXISTS(3003, "邮箱已被注册"),
    PASSWORD_ERROR(3004, "用户名或密码错误"),
    
    // 业务错误 (4xxx)
    SECTOR_NOT_FOUND(4001, "板块不存在"),
    FAVORITE_EXISTS(4002, "已收藏该板块"),
    FAVORITE_NOT_FOUND(4003, "未收藏该板块");

    private final int code;
    private final String message;
}
