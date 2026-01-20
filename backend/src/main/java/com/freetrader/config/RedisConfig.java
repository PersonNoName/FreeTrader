package com.freetrader.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

        /**
         * 创建配置好的 ObjectMapper，用于 Redis 序列化
         * 统一配置，避免重复创建
         */
        private ObjectMapper createRedisObjectMapper() {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
                objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance,
                                ObjectMapper.DefaultTyping.NON_FINAL);
                objectMapper.registerModule(new JavaTimeModule());
                return objectMapper;
        }

        /**
         * 创建 Jackson2JsonRedisSerializer
         */
        private Jackson2JsonRedisSerializer<Object> createJsonSerializer() {
                return new Jackson2JsonRedisSerializer<>(createRedisObjectMapper(), Object.class);
        }

        @Bean
        public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
                RedisTemplate<String, Object> template = new RedisTemplate<>();
                template.setConnectionFactory(factory);

                Jackson2JsonRedisSerializer<Object> serializer = createJsonSerializer();
                StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

                template.setKeySerializer(stringRedisSerializer);
                template.setHashKeySerializer(stringRedisSerializer);
                template.setValueSerializer(serializer);
                template.setHashValueSerializer(serializer);
                template.afterPropertiesSet();

                return template;
        }

        @Bean
        public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
                Jackson2JsonRedisSerializer<Object> serializer = createJsonSerializer();
                StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

                RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(30))
                                .serializeKeysWith(RedisSerializationContext.SerializationPair
                                                .fromSerializer(stringRedisSerializer))
                                .serializeValuesWith(
                                                RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                                .disableCachingNullValues();

                RedisCacheConfiguration shortTtlConfig = RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(5))
                                .serializeKeysWith(RedisSerializationContext.SerializationPair
                                                .fromSerializer(stringRedisSerializer))
                                .serializeValuesWith(
                                                RedisSerializationContext.SerializationPair.fromSerializer(serializer));

                RedisCacheConfiguration mediumTtlConfig = RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(10))
                                .serializeKeysWith(RedisSerializationContext.SerializationPair
                                                .fromSerializer(stringRedisSerializer))
                                .serializeValuesWith(
                                                RedisSerializationContext.SerializationPair.fromSerializer(serializer));

                return RedisCacheManager.builder(factory)
                                .cacheDefaults(defaultConfig)
                                .withCacheConfiguration("sectors", shortTtlConfig)
                                .withCacheConfiguration("sectorDetail", shortTtlConfig)
                                .withCacheConfiguration("userInfo", mediumTtlConfig)
                                .build();
        }
}
