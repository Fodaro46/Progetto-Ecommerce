package com.esempio.Ecommerce.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CartRequest(
        @NotNull(message = "User ID is required")
        Long userId
) {}