package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CartResponse(
        Long id,
        Long userId,
        List<CartItemResponse> items,
        BigDecimal totalPrice,
        Integer totalItems,
        boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}