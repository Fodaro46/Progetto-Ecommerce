package com.esempio.Ecommerce.api.controller.product;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.domain.entity.Product;
import com.esempio.Ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productService.getProducts();
    }

    // Nuovo endpoint per aggiornare la quantità del prodotto
    @PutMapping("/{productId}/quantity")
    public ResponseEntity<Void> updateProductQuantity(
            @PathVariable Long productId,
            @RequestParam int newQuantity) {
        productService.updateProductQuantity(productId, newQuantity);
        return ResponseEntity.ok().build();
    }
    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProductResponse> addProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse newProduct = productService.addProduct(productRequest);
        return ResponseEntity.ok(newProduct);
    }
}
