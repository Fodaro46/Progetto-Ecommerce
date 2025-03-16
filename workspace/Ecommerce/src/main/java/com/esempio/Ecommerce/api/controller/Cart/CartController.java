package com.esempio.Ecommerce.api.controller.Cart;

import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.service.CartService;
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

    public CartController(CartService cartService) {
        this.cartService = cartService;
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
        if (!cart.isPresent()) {
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
}
