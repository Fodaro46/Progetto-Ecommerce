package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.domain.entity.CartItem;

import java.util.List;

public interface CartItemService {

    CartItemResponse addItemToCart(CartItemRequest request);
    List<CartItemResponse> getItemsByCartId(Long cartId);
    CartItemResponse updateItemQuantity(Long cartItemId, Integer quantity);
    void removeItem(Long cartItemId);
}
