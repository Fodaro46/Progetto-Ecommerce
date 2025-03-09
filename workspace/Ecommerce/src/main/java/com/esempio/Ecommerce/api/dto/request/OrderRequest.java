package com.esempio.Ecommerce.api.dto.request;
import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record OrderRequest(
        @NotNull Long addressId,
        @NotEmpty List<OrderItemRequest> items,
        String couponCode
) {}