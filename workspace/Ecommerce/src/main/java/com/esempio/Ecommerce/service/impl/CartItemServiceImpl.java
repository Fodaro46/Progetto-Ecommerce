package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.api.mapper.CartItemMapper;
import com.esempio.Ecommerce.api.repository.CartItemRepository;
import com.esempio.Ecommerce.api.repository.CartRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.service.CartItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemMapper cartItemMapper;

    public CartItemServiceImpl(CartItemRepository cartItemRepository, CartRepository cartRepository,
                               ProductRepository productRepository, CartItemMapper cartItemMapper) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartItemMapper = cartItemMapper;
    }

    @Override
    public CartItemResponse addItemToCart(CartItemRequest request) {
        var cart = cartRepository.findById(request.cartId())
                .orElseThrow(() -> new EntityNotFoundException("Cart not found: " + request.cartId()));

        var product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.productId()));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(request.cartId(), request.productId());

        if (existingItemOpt.isPresent()) {
            var item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.quantity());
            return cartItemMapper.toDto(cartItemRepository.save(item));
        }

        return cartItemMapper.toDto(cartItemRepository.save(
                cartItemMapper.createCartItem(cart, product, request.quantity())));
    }

    @Override
    public List<CartItemResponse> getItemsByCartId(Long cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);

        // 🔍 LOG utile per debugging
        items.forEach(item -> {
            System.out.println("🛒 CartItem ID: " + item.getId());
            if (item.getProduct() != null) {
                System.out.println("📦 Prodotto ID: " + item.getProduct().getId());
                System.out.println("📛 Nome prodotto: " + item.getProduct().getName());
                System.out.println("💶 Prezzo: " + item.getProduct().getPrice());
                System.out.println("🖼️ Immagine: " + item.getProduct().getImageUrl());
            } else {
                System.out.println("❌ Prodotto mancante per item ID: " + item.getId());
            }
        });

        return cartItemMapper.toDtoList(items);
    }

    @Override
    public CartItemResponse updateItemQuantity(Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            removeItem(cartItemId);
            return null;
        }

        return cartItemRepository.findById(cartItemId)
                .map(item -> {
                    item.setQuantity(quantity);
                    return cartItemMapper.toDto(cartItemRepository.save(item));
                })
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found: " + cartItemId));
    }

    @Override
    public void removeItem(Long cartItemId) {
        if (cartItemRepository.existsById(cartItemId)) {
            cartItemRepository.deleteById(cartItemId);
        } else {
            throw new EntityNotFoundException("CartItem not found: " + cartItemId);
        }
    }
}