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

 Date: 07/01/2026 18:53:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for etf_netasset
-- ----------------------------
DROP TABLE IF EXISTS `etf_netasset`;
CREATE TABLE `etf_netasset`  (
  `ths_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `time` date NOT NULL,
  `net_asset_value` float NULL DEFAULT NULL COMMENT '单位净值',
  `adjusted_nav` float NULL DEFAULT NULL COMMENT '复权单位净值',
  `accumulated_nav` float NULL DEFAULT NULL COMMENT '累计单位净值',
  `premium` float NULL DEFAULT NULL COMMENT '贴水',
  `premium_ratio` float NULL DEFAULT NULL COMMENT '贴水率',
  PRIMARY KEY (`ths_code`, `time`) USING BTREE,
  INDEX `idx_etf_time`(`ths_code` ASC, `time` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
