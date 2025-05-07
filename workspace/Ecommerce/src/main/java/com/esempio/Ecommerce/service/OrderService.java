package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.OrderRequest;
import com.esempio.Ecommerce.api.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    /**
     * Crea un nuovo ordine per l'utente specificato
     *
     * @param request Dettagli dell'ordine
     * @param userId ID dell'utente che effettua l'ordine
     * @return Dettagli dell'ordine creato
     */
    OrderResponse createOrder(OrderRequest request, String userId);

    /**
     * Ottiene i dettagli di un ordine specifico
     *
     * @param orderId ID dell'ordine
     * @return Dettagli dell'ordine
     */
    OrderResponse getOrderById(Long orderId);

    /**
     * Ottiene tutti gli ordini di un utente
     *
     * @param userId ID dell'utente
     * @return Lista degli ordini dell'utente
     */
    List<OrderResponse> getUserOrders(String userId);


    OrderResponse updateOrderStatus(Long orderId, String newStatus);
}
