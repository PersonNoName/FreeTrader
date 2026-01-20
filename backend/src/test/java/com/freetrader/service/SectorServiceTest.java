package com.freetrader.service;

import com.freetrader.config.SectorProperties;
import com.freetrader.dto.SectorDTO;
import com.freetrader.dto.SectorDetailDTO;
import com.freetrader.entity.Category;
import com.freetrader.exception.BusinessException;
import com.freetrader.mapper.CalendarMapper;
import com.freetrader.mapper.CategoryMapper;
import com.freetrader.mapper.EtfInfoMapper;
import com.freetrader.mapper.UserCollectionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * SectorService 单元测试
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SectorService 单元测试")
class SectorServiceTest {

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private EtfInfoMapper etfInfoMapper;

    @Mock
    private CalendarMapper calendarMapper;

    @Mock
    private UserCollectionMapper userCollectionMapper;

    @Mock
    private SectorProperties sectorProperties;

    @InjectMocks
    private SectorService sectorService;

    @BeforeEach
    void setUp() {
        // Set default values via reflection for @Value fields
        ReflectionTestUtils.setField(sectorService, "defaultTradingDays", 7);
        ReflectionTestUtils.setField(sectorService, "defaultTopFunds", 10);
        ReflectionTestUtils.setField(sectorService, "estimatedCapMultiplier", 50.0);
        ReflectionTestUtils.setField(sectorService, "basePrice", 1000.0);

        // Use lenient stubbing for sectorProperties since not all tests trigger trend
        // generation
        lenient().when(sectorProperties.getTrendBaseValue()).thenReturn(10.0);
        lenient().when(sectorProperties.getTrendDirectionFactor()).thenReturn(0.3);
        lenient().when(sectorProperties.getTrendDataPoints()).thenReturn(7);
        lenient().when(sectorProperties.getTrendVolatility()).thenReturn(2.0);
    }

    @Nested
    @DisplayName("获取用户收藏测试")
    class GetUserFavoritesTests {

        @Test
        @DisplayName("用户 ID 为空时返回空集合")
        void getUserFavorites_WithNullUserId_ShouldReturnEmptySet() {
            // When
            Set<Integer> result = sectorService.getUserFavorites(null);

            // Then
            assertThat(result).isEmpty();
            verify(userCollectionMapper, never()).findFavoriteCidsByUserId(any());
        }

        @Test
        @DisplayName("用户有收藏时返回收藏列表")
        void getUserFavorites_WithValidUserId_ShouldReturnFavorites() {
            // Given
            Integer userId = 1;
            List<Integer> favorites = List.of(1, 2, 3);
            when(userCollectionMapper.findFavoriteCidsByUserId(userId)).thenReturn(favorites);

            // When
            Set<Integer> result = sectorService.getUserFavorites(userId);

            // Then
            assertThat(result).containsExactlyInAnyOrder(1, 2, 3);
            verify(userCollectionMapper).findFavoriteCidsByUserId(userId);
        }

        @Test
        @DisplayName("用户无收藏时返回空集合")
        void getUserFavorites_WithNoFavorites_ShouldReturnEmptySet() {
            // Given
            Integer userId = 1;
            when(userCollectionMapper.findFavoriteCidsByUserId(userId)).thenReturn(null);

            // When
            Set<Integer> result = sectorService.getUserFavorites(userId);

            // Then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("获取板块详情测试")
    class GetSectorDetailTests {

        @Test
        @DisplayName("板块不存在时抛出异常")
        void getSectorDetail_WithNonExistentSector_ShouldThrowException() {
            // Given
            Integer sectorId = 999;
            when(categoryMapper.selectById(sectorId)).thenReturn(null);

            // When & Then
            assertThatThrownBy(() -> sectorService.getSectorDetail(sectorId, null))
                    .isInstanceOf(BusinessException.class);

            verify(categoryMapper).selectById(sectorId);
        }

        @Test
        @DisplayName("板块存在时返回详情")
        void getSectorDetail_WithValidSector_ShouldReturnDetail() {
            // Given
            Integer sectorId = 1;
            Integer userId = null;

            Category category = new Category();
            category.setCid(sectorId);
            category.setName("科技");
            category.setDescription("科技行业ETF");
            category.setItemCount(10);

            when(categoryMapper.selectById(sectorId)).thenReturn(category);
            when(calendarMapper.findLastNTradingDays(anyString(), anyInt()))
                    .thenReturn(List.of("20260120", "20260119"));
            when(etfInfoMapper.findTopEtfsBySector(anyString(), anyString(), anyString(), anyInt()))
                    .thenReturn(Collections.emptyList());

            // When
            SectorDetailDTO result = sectorService.getSectorDetail(sectorId, userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(sectorId);
            assertThat(result.getName()).isEqualTo("科技");
            assertThat(result.getIsFavorite()).isEqualTo(false);
        }
    }

    @Nested
    @DisplayName("获取所有板块测试")
    class GetAllSectorsTests {

        @Test
        @DisplayName("无用户时返回板块列表（无收藏标记）")
        void getAllSectors_WithNoUser_ShouldReturnSectorsWithoutFavorites() {
            // Given
            when(calendarMapper.findLastNTradingDays(anyString(), anyInt()))
                    .thenReturn(List.of("20260120", "20260119"));

            SectorDTO sector1 = new SectorDTO();
            sector1.setId(1);
            sector1.setName("科技");
            sector1.setChange(2.5);
            sector1.setFundsCount(10);

            when(categoryMapper.findAllSectorsWithAvgChange(anyString(), anyString()))
                    .thenReturn(List.of(sector1));

            // When
            List<SectorDTO> result = sectorService.getAllSectors(null);

            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getIsFavorite()).isFalse();
        }

        @Test
        @DisplayName("有用户时返回板块列表（带收藏标记）")
        void getAllSectors_WithUser_ShouldReturnSectorsWithFavorites() {
            // Given
            Integer userId = 1;
            when(calendarMapper.findLastNTradingDays(anyString(), anyInt()))
                    .thenReturn(List.of("20260120", "20260119"));

            SectorDTO sector1 = new SectorDTO();
            sector1.setId(1);
            sector1.setName("科技");
            sector1.setChange(2.5);
            sector1.setFundsCount(10);

            SectorDTO sector2 = new SectorDTO();
            sector2.setId(2);
            sector2.setName("医药");
            sector2.setChange(-1.2);
            sector2.setFundsCount(8);

            when(categoryMapper.findAllSectorsWithAvgChange(anyString(), anyString()))
                    .thenReturn(List.of(sector1, sector2));
            when(userCollectionMapper.findFavoriteCidsByUserId(userId))
                    .thenReturn(List.of(1)); // User only favorites sector 1

            // When
            List<SectorDTO> result = sectorService.getAllSectors(userId);

            // Then
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getIsFavorite()).isTrue(); // Sector 1 is favorited
            assertThat(result.get(1).getIsFavorite()).isFalse(); // Sector 2 is not favorited
        }
    }
}
