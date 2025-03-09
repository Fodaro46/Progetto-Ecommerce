package com.esempio.Ecommerce.api.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        String productName,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal subtotal
) {}