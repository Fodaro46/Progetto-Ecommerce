package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;
import com.esempio.Ecommerce.domain.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    // Da Order a OrderResponse
    @Mapping(target = "items",      source = "items")         // userà OrderItemMapper.toResponse
    @Mapping(target = "userEmail",  source = "user.email")    // se esiste un 'email' in LocalUser
    OrderResponse toResponse(Order order);

    // Da OrderRequest a Order
    @Mapping(target = "id",         ignore = true)
    @Mapping(target = "createdAt",  ignore = true)
    @Mapping(target = "updatedAt",  ignore = true)
    @Mapping(target = "status",     ignore = true) // se non vuoi farlo impostare dal client
    @Mapping(target = "total",      ignore = true) // calcolato a partire dai items
    @Mapping(target = "user",       ignore = true) // se gestisci altrove il settaggio dell'utente
    @Mapping(target = "items",      source = "items")         // userà OrderItemMapper.toEntity
    Order toEntity(OrderRequest request);
}

