
package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record InventoryResponse(
        Long id,
        Long productId,
        String productName,
        Integer quantity,
        LocalDateTime updatedAt
) {}