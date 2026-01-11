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

 Date: 07/01/2026 18:52:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `cid` int NOT NULL AUTO_INCREMENT COMMENT '类别唯一标识（自增主键）',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别名称（如“科技”“体育”）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '类别描述（可选，说明该类别的内容）',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序权重（数值越大越靠前，用于前端展示排序）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-启用，0-禁用（逻辑删除，避免物理删除影响历史收藏）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '类别创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '类别更新时间',
  `item_count` int NOT NULL DEFAULT 0 COMMENT '该类别包含的记录数量',
  PRIMARY KEY (`cid`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name` ASC) USING BTREE COMMENT '类别名称唯一，避免重复',
  INDEX `idx_status`(`status` ASC) USING BTREE COMMENT '筛选启用/禁用类别的索引'
) ENGINE = InnoDB AUTO_INCREMENT = 64 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '类别表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
