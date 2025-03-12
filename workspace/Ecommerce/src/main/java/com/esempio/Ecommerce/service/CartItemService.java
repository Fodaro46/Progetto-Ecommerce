package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.domain.entity.CartItem;
import java.util.List;

public interface CartItemService {
    List<CartItem> getItemsByCartId(Long cartId);
    void updateItemQuantity(Long cartItemId, Integer quantity);
}