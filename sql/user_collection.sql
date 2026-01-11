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

 Date: 07/01/2026 18:53:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_collection
-- ----------------------------
DROP TABLE IF EXISTS `user_collection`;
CREATE TABLE `user_collection`  (
  `collect_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏记录唯一标识',
  `user_id` int UNSIGNED NOT NULL COMMENT '关联的用户ID（外键，用户删除时自动删除其所有收藏记录）',
  `cid` int NOT NULL COMMENT '兴趣类别标识（关联已存在的兴趣表，兴趣类别删除时自动删除关联的收藏记录）',
  `collect_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`collect_id`) USING BTREE,
  UNIQUE INDEX `uk_user_cid`(`user_id` ASC, `cid` ASC) USING BTREE COMMENT '同一用户不能重复收藏同一兴趣类别',
  INDEX `idx_cid`(`cid` ASC) USING BTREE COMMENT '通过兴趣类别查询收藏用户的索引',
  CONSTRAINT `fk_collection_category` FOREIGN KEY (`cid`) REFERENCES `category` (`cid`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_collection_user` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 120 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户兴趣收藏表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
