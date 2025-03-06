package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.model.Entity.Inventory;
import com.esempio.Ecommerce.model.Entity.Product;
import com.esempio.Ecommerce.model.repository.InventoryRepository;
import com.esempio.Ecommerce.model.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public ProductService(ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public void updateProductQuantity(Long productId, int newQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Inventory inventory = product.getInventory();
        inventory.setQuantity(newQuantity);
        inventoryRepository.save(inventory);  // Gestione della versione per l'optimistic locking
    }
}
