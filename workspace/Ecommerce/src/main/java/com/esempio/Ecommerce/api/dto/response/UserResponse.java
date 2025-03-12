
package com.esempio.Ecommerce.api.dto.response;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}