package com.esempio.Ecommerce.api.dto.response;

import com.esempio.Ecommerce.domain.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal total,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {}