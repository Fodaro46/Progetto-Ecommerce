package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request, String userId);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getUserOrders(String userId);
}