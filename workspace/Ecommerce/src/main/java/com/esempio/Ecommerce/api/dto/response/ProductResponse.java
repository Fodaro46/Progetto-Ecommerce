package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record ProductResponse(
        Long id,
        String name,
        String description,
        Double price,
        String imageUrl,
        String category,
        boolean inStock,
        Integer availableQuantity,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}