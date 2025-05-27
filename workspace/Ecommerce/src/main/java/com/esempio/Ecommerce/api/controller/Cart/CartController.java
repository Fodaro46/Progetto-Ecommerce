package com.esempio.Ecommerce.api.controller.Cart;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.domain.entity.Cart;
import com.esempio.Ecommerce.domain.entity.CartItem;
import com.esempio.Ecommerce.service.CartService;
import com.esempio.Ecommerce.service.CartItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;

    @Autowired
    public CartController(CartService cartService,
                          CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getSubject();
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof String) {
            return (String) principal;
        } else if (principal instanceof Jwt jwt) {
            return jwt.getSubject();
        }

        return auth.getName();
    }

    @GetMapping("/active")
    public ResponseEntity<Cart> getActiveCart() {
        String userId = getAuthenticatedUserId();
        Optional<Cart> cart = cartService.getActiveCartForUser(userId);

        if (cart.isEmpty()) {
            cart = Optional.of(cartService.createNewCart(userId));
        }

        return cart.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        List<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/active")
    public ResponseEntity<Cart> addItemToCart(
            @Valid @RequestBody CartItemRequest request
    ) {
        Cart cart = cartService.addItemToCart(
                request.cartId(),
                request.productId(),
                request.quantity()
        );
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItemResponse> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        CartItemResponse response =
                cartItemService.updateItemQuantity(itemId, quantity);
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
        Optional<Cart> opt = cartService.getActiveCartForUser(userId);
        if (opt.isPresent()) {
            cartService.clearCart(opt.get().getId());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
