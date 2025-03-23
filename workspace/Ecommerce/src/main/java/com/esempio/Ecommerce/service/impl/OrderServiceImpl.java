package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.OrderItemRequest;
import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderItemResponse;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;
import com.esempio.Ecommerce.domain.entity.*;
import com.esempio.Ecommerce.domain.enums.OrderStatus;
import com.esempio.Ecommerce.exception.InsufficientStockException;
import com.esempio.Ecommerce.exception.NotFoundException;
import com.esempio.Ecommerce.api.repository.InventoryRepository;
import com.esempio.Ecommerce.api.repository.OrderRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.api.repository.LocalUserRepository;
import com.esempio.Ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final LocalUserRepository userRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request, String userId) {
        log.info("Creazione ordine per utente: {}", userId);

        // Recupera l'utente
        LocalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato: " + userId));

        // Crea l'ordine
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .build();

        // Processa gli item
        List<OrderItem> orderItems = processOrderItems(request.items(), order);
        order.setItems(orderItems);

        // Calcola il totale
        Double subtotal = calculateSubtotal(orderItems);
        order.setTotal(subtotal);

        // Salva l'ordine e aggiorna l'inventario
        Order savedOrder = orderRepository.save(order);
        updateInventory(orderItems);

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        log.info("Recupero ordine: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Ordine non trovato: " + orderId));

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userId) {
        log.info("Recupero ordini per utente: {}", userId);

        LocalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato: " + userId));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);

        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    private List<OrderItem> processOrderItems(List<OrderItemRequest> itemRequests, Order order) {
        return itemRequests.stream()
                .map(itemRequest -> {
                    // Recupera il prodotto
                    Product product = productRepository.findById(itemRequest.productId())
                            .orElseThrow(() -> new NotFoundException("Prodotto non trovato: " + itemRequest.productId()));

                    // Verifica disponibilità
                    Inventory inventory = inventoryRepository.findByProductId(product.getId())
                            .orElseThrow(() -> new NotFoundException("Inventario non trovato per prodotto: " + product.getId()));

                    if (inventory.getQuantity() < itemRequest.quantity()) {
                        throw new InsufficientStockException(
                                "Stock insufficiente. Disponibili: " + inventory.getQuantity() + ", richiesti: " + itemRequest.quantity());
                    }

                    // Crea l'item
                    Double unitPrice = product.getPrice();
                    Double subtotal = unitPrice * itemRequest.quantity();

                    OrderItem orderItem = OrderItem.builder()
                            .order(order)
                            .product(product)
                            .quantity(itemRequest.quantity())
                            .unitPrice(unitPrice)
                            .subtotal(subtotal)
                            .build();

                    return orderItem;
                })
                .collect(Collectors.toList());
    }

    private Double calculateSubtotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(item -> item.getSubtotal())
                .sum();
    }

    private void updateInventory(List<OrderItem> items) {
        items.forEach(item -> {
            Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                    .orElseThrow(() -> new NotFoundException("Inventario non trovato per prodotto: " + item.getProduct().getId()));

            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);
        });
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUser().getEmail())
                .status(order.getStatus())
                .total(order.getTotal())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Ordine non trovato: " + orderId));
        try {
            // Convertiamo la stringa in enum; se la stringa non è valida viene generata un'eccezione
            OrderStatus statusEnum = OrderStatus.valueOf(newStatus.toUpperCase());
            order.setStatus(statusEnum);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Stato dell'ordine non valido: " + newStatus);
        }
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }
}