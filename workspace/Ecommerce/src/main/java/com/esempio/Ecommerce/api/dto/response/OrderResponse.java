
package com.esempio.Ecommerce.api.dto.response;

import com.esempio.Ecommerce.domain.enums.OrderStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record OrderResponse(
        Long id,
        String userEmail,
        OrderStatus status,
        BigDecimal total,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {}