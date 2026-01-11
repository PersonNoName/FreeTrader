package com.freetrader;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.freetrader.mapper")
public class FreeTraderApplication {

    public static void main(String[] args) {
        SpringApplication.run(FreeTraderApplication.class, args);
    }
}
