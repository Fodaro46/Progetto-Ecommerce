package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.CartRequest;
import com.esempio.Ecommerce.api.dto.response.CartResponse;
import com.esempio.Ecommerce.domain.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "items", source = "cartItems")
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(cart))")
    @Mapping(target = "totalItems", expression = "java(calculateTotalItems(cart))")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    CartResponse toDto(Cart cart);

    List<CartResponse> toDtoList(List<Cart> carts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "cartItems", ignore = true)
    Cart toEntity(CartRequest cartRequest);

    default Double calculateTotalPrice(Cart cart) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            return 0.0;
        }

        return cart.getCartItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    default Integer calculateTotalItems(Cart cart) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            return 0;
        }

        return cart.getCartItems().stream()
                .mapToInt(item -> item.getQuantity())
                .sum();
    }
}