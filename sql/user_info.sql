/*
 Navicat Premium Data Transfer

 Source Server         : free
 Source Server Type    : MySQL
 Source Server Version : 80036 (8.0.36)
 Source Host           : 106.12.52.116:1999
 Source Schema         : freetrader

 Target Server Type    : MySQL
 Target Server Version : 80036 (8.0.36)
 File Encoding         : 65001

 Date: 07/01/2026 18:53:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户唯一标识（自增主键）',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名（登录名）',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户邮箱（用于登录/找回密码）',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码（建议存储加密后的值，如bcrypt哈希）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE COMMENT '用户名唯一，避免重复注册',
  UNIQUE INDEX `uk_email`(`email` ASC) USING BTREE COMMENT '邮箱唯一，避免重复注册'
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户核心信息表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
