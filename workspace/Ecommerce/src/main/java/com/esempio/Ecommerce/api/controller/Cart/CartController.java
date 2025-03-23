package com.esempio.Ecommerce.api.controller.Cart;

import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.service.CartService;
import com.esempio.Ecommerce.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;

    @Autowired
    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    private String getAuthenticatedUserId() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwt.getClaim("sub"); // Keycloak User ID (UUID)
    }

    @GetMapping("/active")
    public ResponseEntity<Cart> getActiveCart() {
        String userId = getAuthenticatedUserId();
        Optional<Cart> cart = cartService.getActiveCartForUser(userId);

        // Se non esiste il carrello, crealo
        if (cart.isEmpty()) {
            cart = Optional.of(cartService.createNewCart(userId));  // Modificato il nome del metodo
        }

        return cart.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        List<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/active")
    public ResponseEntity<Cart> addItemToCart(@RequestBody CartItem cartItem) {
        String userId = getAuthenticatedUserId();
        Cart cart = cartService.addItemToCart(userId, cartItem.getProduct().getId(), cartItem.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItemResponse> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        CartItemResponse response = cartItemService.updateItemQuantity(itemId, quantity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long itemId) {
        cartItemService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/active")
    public ResponseEntity<Void> clearCart() {
        String userId = getAuthenticatedUserId();
        // Ottieni il carrello attivo e rimuovi tutti gli item
        Optional<Cart> activeCartOpt = cartService.getActiveCartForUser(userId);
        if (activeCartOpt.isPresent()) {
            Cart activeCart = activeCartOpt.get();
            List<CartItem> items = cartService.getCartItems(activeCart.getId());
            items.forEach(item -> cartItemService.removeItem(item.getId()));
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}