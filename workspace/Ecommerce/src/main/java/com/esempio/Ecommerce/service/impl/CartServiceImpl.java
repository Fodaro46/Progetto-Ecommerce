package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.domain.entity.Product;
import com.esempio.Ecommerce.api.repository.CartItemRepository;
import com.esempio.Ecommerce.api.repository.CartRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.service.CartService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @PersistenceContext
    private EntityManager entityManager;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Cart addItemToCart(String userId, Long productId, Integer quantity) {
        Cart cart = cartRepository.findByUserIdAndIsActiveTrue(userId)
                .orElseGet(() -> createNewCart(userId));

        cart = entityManager.find(Cart.class, cart.getId(), LockModeType.PESSIMISTIC_WRITE);

        addOrUpdateCartItem(cart, productId, quantity);

        return cart;
    }

    private void addOrUpdateCartItem(Cart cart, Long productId, Integer quantity) {
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);

            cartItemRepository.save(newItem);
        }
    }

    public Cart createNewCart(String userId) {
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setIsActive(true);
        return cartRepository.save(newCart);
    }

    @Override
    public Optional<Cart> getActiveCartForUser(String userId) {
        return cartRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public List<CartItem> getCartItems(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }
}
