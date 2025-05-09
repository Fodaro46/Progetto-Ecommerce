package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;

@Builder
public record ProductRequest(
        @NotBlank(message = "Product name is required")
        String name,

        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Double price,

        String imageUrl,

        @NotNull(message = "Category is required")
        String category,

        @NotNull(message = "Stock quantity is required")
        @PositiveOrZero(message = "Stock quantity must be zero or positive")
        Integer stockQuantity
) {}
