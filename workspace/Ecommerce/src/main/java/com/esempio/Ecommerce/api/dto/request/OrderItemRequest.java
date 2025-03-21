package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record OrderItemRequest(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity
) {}