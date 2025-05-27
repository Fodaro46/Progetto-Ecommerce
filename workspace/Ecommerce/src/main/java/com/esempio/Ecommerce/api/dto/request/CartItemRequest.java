package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


public record CartItemRequest(
        @NotNull(message = "Cart ID is required")
        Long cartId,

        @NotNull(message = "Product ID is required")
        Long productId,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        Integer quantity
) {}