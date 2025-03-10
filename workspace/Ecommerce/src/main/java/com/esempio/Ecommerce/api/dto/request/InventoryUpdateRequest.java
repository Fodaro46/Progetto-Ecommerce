package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record InventoryUpdateRequest(
        @NotNull Long productId,
        @NotNull @Min(0) Integer quantity
) {}