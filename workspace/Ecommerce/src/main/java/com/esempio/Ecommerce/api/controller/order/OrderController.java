package com.esempio.Ecommerce.api.controller.order;

import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;
import com.esempio.Ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        OrderResponse response = orderService.createOrder(request, jwt.getSubject());
        return ResponseEntity
                .created(URI.create("/api/orders/" + response.id()))
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        List<OrderResponse> orders = orderService.getUserOrders(jwt.getSubject());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String newStatus) { // riceviamo il nuovo stato come parametro
        OrderResponse response = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(response);
    }

    }