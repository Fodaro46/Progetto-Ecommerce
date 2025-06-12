package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.InventoryUpdateRequest;
import com.esempio.Ecommerce.api.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryService {

    InventoryResponse getInventoryByProductId(Long productId);
    List<InventoryResponse> getAllInventory();
    InventoryResponse updateInventory(InventoryUpdateRequest request);
}