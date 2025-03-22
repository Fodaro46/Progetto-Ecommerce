package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.domain.entity.Inventory;
import com.esempio.Ecommerce.domain.entity.Product;
import com.esempio.Ecommerce.api.repository.InventoryRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void updateProductQuantity(Long productId, int newQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato"));
        Inventory inventory = product.getInventory();
        inventory.setQuantity(newQuantity);
        inventoryRepository.save(inventory);  // Gestione della versione per l'optimistic locking
    }

    @Override
    @Transactional
    public ProductResponse addProduct(ProductRequest productRequest) {
        // Creazione del prodotto
        Product product = new Product();
        product.setName(productRequest.name());
        product.setShortDescription(productRequest.description());  // Mapping del description al shortDescription
        product.setLongDescription(productRequest.description());   // Usiamo lo stesso valore per longDescription
        product.setPrice(productRequest.price());

        // Salvataggio del prodotto
        Product savedProduct = productRepository.save(product);

        // Creazione dell'inventario associato
        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setQuantity(0); // Quantità iniziale a zero
        inventoryRepository.save(inventory);

        // Associazione dell'inventario al prodotto
        savedProduct.setInventory(inventory);

        // Costruzione della risposta
        return ProductResponse.builder()
                .id(savedProduct.getId())
                .name(savedProduct.getName())
                .description(savedProduct.getShortDescription())  // Usiamo shortDescription
                .price(savedProduct.getPrice())
                .imageUrl(null)  // Non presente nell'entità
                .category(productRequest.category())  // Non presente nell'entità, ma presente nel DTO
                .inStock(inventory.getQuantity() > 0)
                .availableQuantity(inventory.getQuantity())
                .createdAt(savedProduct.getCreatedAt())
                .updatedAt(savedProduct.getUpdatedAt())
                .build();
    }
}