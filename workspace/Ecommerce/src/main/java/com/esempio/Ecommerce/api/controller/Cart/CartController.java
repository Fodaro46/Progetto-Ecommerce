package com.esempio.Ecommerce.api.controller.Cart;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.api.dto.response.CartResponse;
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
    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getSubject();
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
    public ResponseEntity<CartResponse> getActiveCart() {
        String userId = getAuthenticatedUserId();
        Optional<Cart> cartOpt = cartService.getActiveCartForUser(userId);

        Cart cart = cartOpt.orElseGet(() -> cartService.createNewCart(userId));

        List<CartItemResponse> cartItems = cartItemService.getItemsByCartId(cart.getId());

        double totalPrice = cartItems.stream()
                .mapToDouble(CartItemResponse::totalPrice)
                .sum();

        CartResponse response = CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(cartItems)
                .totalPrice(totalPrice)
                .totalItems(cartItems.size())
                .isActive(cart.getIsActive())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        List<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/active")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        Cart cart = cartService.addItemToCart(
                request.cartId(),
                request.productId(),
                request.quantity()
        );

        List<CartItemResponse> cartItems = cartItemService.getItemsByCartId(cart.getId());

        double totalPrice = cartItems.stream()
                .mapToDouble(CartItemResponse::totalPrice)
                .sum();

        CartResponse response = CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(cartItems)
                .totalPrice(totalPrice)
                .totalItems(cartItems.size())
                .isActive(cart.getIsActive())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItemResponse> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
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
        Optional<Cart> opt = cartService.getActiveCartForUser(userId);
        if (opt.isPresent()) {
            cartService.clearCart(opt.get().getId());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
