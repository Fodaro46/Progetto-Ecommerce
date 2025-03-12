package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.domain.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productImageUrl", ignore = true)
    @Mapping(target = "unitPrice", expression = "java(BigDecimal.valueOf(cartItem.getProduct().getPrice()))")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(cartItem))")
    CartItemResponse toDto(CartItem cartItem);

    List<CartItemResponse> toDtoList(List<CartItem> cartItems);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    CartItem toEntity(CartItemRequest cartItemRequest);

    @Named("calculateTotalPrice")
    default BigDecimal calculateTotalPrice(CartItem cartItem) {
        if (cartItem.getProduct() == null || cartItem.getQuantity() == null) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(cartItem.getProduct().getPrice())
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
    }

    default CartItem createCartItem(Cart cart, Product product, Integer quantity) {
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setCreatedAt(java.time.LocalDateTime.now());
        return cartItem;
    }
}