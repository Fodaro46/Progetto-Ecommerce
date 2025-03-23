package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.api.mapper.ProductMapper;
import com.esempio.Ecommerce.domain.entity.Inventory;
import com.esempio.Ecommerce.domain.entity.Product;
import com.esempio.Ecommerce.api.repository.InventoryRepository;
import com.esempio.Ecommerce.api.repository.ProductRepository;
import com.esempio.Ecommerce.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductMapper productMapper; // dichiarato come final

    // Iniezione via costruttore
    public ProductServiceImpl(ProductRepository productRepository,
                              InventoryRepository inventoryRepository,
                              ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.productMapper = productMapper; // viene inizializzato correttamente
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
        inventoryRepository.save(inventory);
    }

    @Override
    @Transactional
    public ProductResponse addProduct(ProductRequest productRequest) {
        // Creazione del prodotto
        Product product = new Product();
        product.setName(productRequest.name());
        product.setShortDescription(productRequest.description());
        product.setLongDescription(productRequest.description());
        product.setPrice(productRequest.price());

        // Salvataggio del prodotto
        Product savedProduct = productRepository.save(product);

        // Creazione dell'inventario associato
        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setQuantity(0);
        inventoryRepository.save(inventory);

        // Associazione dell'inventario al prodotto
        savedProduct.setInventory(inventory);

        return ProductResponse.builder()
                .id(savedProduct.getId())
                .name(savedProduct.getName())
                .description(savedProduct.getShortDescription())
                .price(savedProduct.getPrice())
                .imageUrl(null)
                .category(productRequest.category())
                .inStock(inventory.getQuantity() > 0)
                .availableQuantity(inventory.getQuantity())
                .createdAt(savedProduct.getCreatedAt())
                .updatedAt(savedProduct.getUpdatedAt())
                .build();
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato: " + id));
        return productMapper.toDto(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato: " + id));
        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> searchProducts(String name, String category, Double minPrice, Double maxPrice) {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.stream()
                .filter(p -> (name == null || p.getName().toLowerCase().contains(name.toLowerCase())))
                .filter(p -> (category == null || p.getCategory().equalsIgnoreCase(category)))
                .filter(p -> (minPrice == null || p.getPrice() >= minPrice))
                .filter(p -> (maxPrice == null || p.getPrice() <= maxPrice))
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
}
