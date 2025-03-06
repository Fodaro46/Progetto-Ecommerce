package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.model.Entity.Cart;
import com.esempio.Ecommerce.model.Entity.CartItem;
import com.esempio.Ecommerce.model.Entity.Product;
import com.esempio.Ecommerce.model.repository.CartItemRepository;
import com.esempio.Ecommerce.model.repository.CartRepository;
import com.esempio.Ecommerce.model.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @PersistenceContext
    private EntityManager entityManager;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Cart addItemToCart(Long userId, Long productId, Integer quantity) {
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

    private Cart createNewCart(Long userId) {
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setIsActive(true);
        return cartRepository.save(newCart);
    }

    public Optional<Cart> getActiveCartForUser(Long userId) {
        return cartRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public List<CartItem> getCartItems(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }
}
