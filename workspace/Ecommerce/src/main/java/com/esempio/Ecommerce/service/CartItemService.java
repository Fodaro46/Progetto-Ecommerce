package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.model.Entity.CartItem;
import com.esempio.Ecommerce.model.repository.CartItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public List<CartItem> getItemsByCartId(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    @Transactional
    public void updateItemQuantity(Long cartItemId, Integer quantity) {
        cartItemRepository.findById(cartItemId).ifPresent(item -> {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        });
    }
}
