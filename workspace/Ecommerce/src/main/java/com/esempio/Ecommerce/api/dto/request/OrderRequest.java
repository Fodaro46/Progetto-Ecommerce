package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
public record OrderRequest(
        @NotNull Long addressId,
        @NotEmpty @Valid List<OrderItemRequest> items,
        String couponCode
) {}