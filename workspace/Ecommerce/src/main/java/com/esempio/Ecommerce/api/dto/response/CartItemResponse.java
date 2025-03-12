package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;
import java.math.BigDecimal;

@Builder
public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImageUrl,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal totalPrice
) {}