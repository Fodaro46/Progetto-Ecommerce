package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CartResponse(
        Long id,
        String userId,
        List<CartItemResponse> items,
        Double totalPrice,
        Integer totalItems,
        boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}