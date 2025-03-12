package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartService {
    Cart addItemToCart(Long userId, Long productId, Integer quantity);
    Optional<Cart> getActiveCartForUser(Long userId);
    List<CartItem> getCartItems(Long cartId);
}