package com.esempio.Ecommerce.api.controller.product;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /** Lista tutti i prodotti come DTO */
    @GetMapping
    public List<ProductResponse> getProducts() {
        return productService.getProducts();
    }

    /** Ottieni un singolo prodotto */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse dto = productService.getProductById(id);
        return ResponseEntity.ok(dto);
    }

    /** Crea un nuovo prodotto (solo admin) */
    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProductResponse> addProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse dto = productService.addProduct(request);
        return ResponseEntity.ok(dto);
    }

    /** Elimina un prodotto (solo admin) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /** Aggiorna la quantità in magazzino */
    @PutMapping("/{productId}/quantity")
    public ResponseEntity<Void> updateProductQuantity(
            @PathVariable Long productId,
            @RequestParam int newQuantity) {
        productService.updateProductQuantity(productId, newQuantity);
        return ResponseEntity.ok().build();
    }

    /** Ricerca / filtro prodotti */
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        List<ProductResponse> results =
                productService.searchProducts(name, category, minPrice, maxPrice);
        return ResponseEntity.ok(results);
    }
}
