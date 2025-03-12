package com.esempio.Ecommerce.api.controller.CartItem;

import com.esempio.Ecommerce.api.dto.request.CartItemRequest;
import com.esempio.Ecommerce.api.dto.response.CartItemResponse;
import com.esempio.Ecommerce.service.CartItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts/items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        CartItemResponse response = cartItemService.addItemToCart(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateItemQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        CartItemResponse response = cartItemService.updateItemQuantity(id, quantity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        cartItemService.removeItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItemResponse>> getItemsByCartId(@PathVariable Long cartId) {
        List<CartItemResponse> items = cartItemService.getItemsByCartId(cartId);
        return ResponseEntity.ok(items);
    }
}