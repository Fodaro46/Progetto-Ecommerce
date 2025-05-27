package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartService {

    Cart addItemToCart(String userId, Long productId, Integer quantity);

    Cart addItemToCart(Long cartId, Long productId, Integer quantity);

    Optional<Cart> getActiveCartForUser(String userId);

    List<CartItem> getCartItems(Long cartId);

    Cart createNewCart(String userId);

    void clearCart(Long cartId);
}
