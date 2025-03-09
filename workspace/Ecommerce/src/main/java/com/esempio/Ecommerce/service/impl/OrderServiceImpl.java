package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.OrderItemRequest;
import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;
import com.esempio.Ecommerce.api.mapper.OrderMapper;
import com.esempio.Ecommerce.api.repository.*;
import com.esempio.Ecommerce.domain.entity.*;
import com.esempio.Ecommerce.exception.InsufficientStockException;
import com.esempio.Ecommerce.exception.UserNotFoundException;
import com.esempio.Ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CouponRepository couponRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderResponse createOrder(OrderRequest request, String userId) {
        // 1. Recupera l'utente
        LocalUser user = LocalUserRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 2. Processa gli item
        List<OrderItem> orderItems = processOrderItems(request.items());

        // 3. Calcola totale
        BigDecimal subtotal = calculateSubtotal(orderItems);
        BigDecimal discount = applyCoupon(request.couponCode(), subtotal);
        BigDecimal total = subtotal.subtract(discount);

        // 4. Crea l'ordine
        Order order = Order.builder()
                .user(user)
                .items(orderItems)
                .total(total)
                .status(OrderStatus.PENDING)
                .build();

        // 5. Salva e aggiorna inventario
        Order savedOrder = orderRepository.save(order);
        updateInventory(orderItems);

        return orderMapper.toResponse(savedOrder);
    }

    private List<OrderItem> processOrderItems(List<OrderItemRequest> items) {
        return items.stream().map(item -> {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ProductNotFoundException(item.productId()));

            Inventory inventory = inventoryRepository.findByProduct(product)
                    .orElseThrow(() -> new InventoryNotFoundException(product.getId()));

            validateStock(inventory, item.quantity());

            return OrderItem.builder()
                    .product(product)
                    .quantity(item.quantity())
                    .build();
        }).toList();
    }

    private void validateStock(Inventory inventory, Integer requestedQuantity) {
        if (inventory.getStock() < requestedQuantity) {
            throw new InsufficientStockException(
                    "Disponibilità: " + inventory.getStock() + ", Richiesti: " + requestedQuantity
            );
        }
    }
}