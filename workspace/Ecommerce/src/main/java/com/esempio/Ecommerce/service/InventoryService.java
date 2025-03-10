// InventoryService.java
package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.InventoryUpdateRequest;
import com.esempio.Ecommerce.api.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryService {
    /**
     * Ottiene l'inventario per un prodotto specifico
     *
     * @param productId ID del prodotto
     * @return Dettagli dell'inventario
     */
    InventoryResponse getInventoryByProductId(Long productId);

    /**
     * Ottiene tutti gli inventari
     *
     * @return Lista di tutti gli inventari
     */
    List<InventoryResponse> getAllInventory();

    /**
     * Aggiorna la quantità in inventario per un prodotto
     *
     * @param request Dettagli dell'aggiornamento
     * @return Inventario aggiornato
     */
    InventoryResponse updateInventory(InventoryUpdateRequest request);
}