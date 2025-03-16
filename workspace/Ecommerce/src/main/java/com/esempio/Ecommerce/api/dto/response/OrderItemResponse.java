package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;

@Builder
public record OrderItemResponse(
        Long productId,
        String productName,
        Double unitPrice,
        Integer quantity,
        Double subtotal
) {}