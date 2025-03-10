package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.InventoryUpdateRequest;
import com.esempio.Ecommerce.api.dto.response.InventoryResponse;
import com.esempio.Ecommerce.domain.entity.Inventory;
import com.esempio.Ecommerce.domain.entity.Product;
import com.esempio.Ecommerce.exception.NotFoundException;
import com.esempio.Ecommerce.api.repository.InventoryRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        log.info("Recupero inventario per prodotto: {}", productId);

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Inventario non trovato per prodotto: " + productId));

        return mapToInventoryResponse(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        log.info("Recupero tutti gli inventari");

        return inventoryRepository.findAll().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InventoryResponse updateInventory(InventoryUpdateRequest request) {
        log.info("Aggiornamento inventario per prodotto: {}", request.productId());

        // Recupera il prodotto
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Prodotto non trovato: " + request.productId()));

        // Recupera o crea un nuovo inventario
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElse(Inventory.builder().product(product).version(0L).build());

        // Aggiorna la quantità
        inventory.setQuantity(request.quantity());

        // Salva l'inventario
        Inventory savedInventory = inventoryRepository.save(inventory);

        return mapToInventoryResponse(savedInventory);
    }

    private InventoryResponse mapToInventoryResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .quantity(inventory.getQuantity())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}