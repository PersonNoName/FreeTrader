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

 Date: 07/01/2026 18:52:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for etf_info
-- ----------------------------
DROP TABLE IF EXISTS `etf_info`;
CREATE TABLE `etf_info`  (
  `ths_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `chinese_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `start_day` date NULL DEFAULT NULL,
  `end_day` date NULL DEFAULT NULL,
  `sector` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ths_code`) USING BTREE,
  INDEX `idx_etf_id`(`ths_code` ASC) USING BTREE,
  INDEX `idx_etf_category`(`sector` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Triggers structure for table etf_info
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_etf_insert_after`;
delimiter ;;
CREATE TRIGGER `tr_etf_insert_after` AFTER INSERT ON `etf_info` FOR EACH ROW BEGIN
  
  UPDATE `category` 
  SET `item_count` = `item_count` + 1,
      `updated_at` = CURRENT_TIMESTAMP
  WHERE `name` = NEW.sector;
  
  
  IF ROW_COUNT() = 0 AND NEW.sector IS NOT NULL AND NEW.sector != '' THEN
    INSERT INTO `category` (`name`, `item_count`)
    VALUES (NEW.sector, 1);
  END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table etf_info
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_etf_update_after`;
delimiter ;;
CREATE TRIGGER `tr_etf_update_after` AFTER UPDATE ON `etf_info` FOR EACH ROW BEGIN
  -- 仅当 sector 发生变化时才执行（避免无意义更新）
  IF OLD.sector != NEW.sector THEN
    -- 旧类别数量-1
    IF OLD.sector IS NOT NULL AND OLD.sector != '' THEN
      UPDATE `category` 
      SET `item_count` = `item_count` - 1,
          `updated_at` = CURRENT_TIMESTAMP
      WHERE `name` = OLD.sector;
    END IF;
    
    -- 新类别数量+1（若不存在则自动插入）
    IF NEW.sector IS NOT NULL AND NEW.sector != '' THEN
      UPDATE `category` 
      SET `item_count` = `item_count` + 1,
          `updated_at` = CURRENT_TIMESTAMP
      WHERE `name` = NEW.sector;
      
      -- 若新类别不存在，自动插入（初始数量为1）
      IF ROW_COUNT() = 0 THEN
        INSERT INTO `category` (`name`, `item_count`)
        VALUES (NEW.sector, 1);
      END IF;
    END IF;
  END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table etf_info
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_etf_delete_after`;
delimiter ;;
CREATE TRIGGER `tr_etf_delete_after` AFTER DELETE ON `etf_info` FOR EACH ROW BEGIN
  -- 旧类别数量-1（仅当 sector 非空时）
  IF OLD.sector IS NOT NULL AND OLD.sector != '' THEN
    UPDATE `category` 
    SET `item_count` = `item_count` - 1,
        `updated_at` = CURRENT_TIMESTAMP
    WHERE `name` = OLD.sector;
  END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
