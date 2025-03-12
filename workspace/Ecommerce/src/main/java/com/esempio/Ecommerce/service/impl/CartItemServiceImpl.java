package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.api.repository.CartItemRepository;
import com.esempio.Ecommerce.service.CartItemService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    @Transactional
    public List<CartItem> getItemsByCartId(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    @Override
    @Transactional
    public void updateItemQuantity(Long cartItemId, Integer quantity) {
        cartItemRepository.findById(cartItemId).ifPresent(item -> {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        });
    }
}