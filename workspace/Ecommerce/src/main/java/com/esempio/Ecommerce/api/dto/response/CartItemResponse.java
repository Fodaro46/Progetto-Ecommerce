package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;

@Builder
public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImageUrl,
        Double unitPrice,
        Integer quantity,
        Double totalPrice
) {}