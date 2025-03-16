package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.OrderItemRequest;
import com.esempio.Ecommerce.api.dto.response.OrderItemResponse;
import com.esempio.Ecommerce.domain.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    // Mappa da OrderItem a OrderItemResponse
    @Mapping(target = "productId",   source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "unitPrice",   source = "unitPrice")
    @Mapping(target = "quantity",    source = "quantity")
    @Mapping(target = "subtotal",    source = "subtotal")
    OrderItemResponse toResponse(OrderItem item);

    // Mappa da OrderItemRequest a OrderItem
    @Mapping(target = "id",         ignore = true)
    @Mapping(target = "order",      ignore = true)  // verrà impostato quando lo aggiungi all'Order
    @Mapping(target = "product",    ignore = true)  // se vuoi gestire la lookup del product altrove
    @Mapping(target = "unitPrice",  ignore = true)  // calcolato altrove
    @Mapping(target = "subtotal",   ignore = true)  // calcolato altrove
    OrderItem toEntity(OrderItemRequest request);
}
