package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;
import com.esempio.Ecommerce.domain.entity.Order;
import org.mapstruct.Mapper;
import org.springframework.web.bind.annotation.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Order toEntity(OrderRequest request);
}