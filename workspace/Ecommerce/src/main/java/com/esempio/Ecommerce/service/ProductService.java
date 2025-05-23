package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getProducts();
    ProductResponse getProductById(Long id);
    ProductResponse addProduct(ProductRequest productRequest);
    void updateProductQuantity(Long productId, int newQuantity);
    void deleteProduct(Long id);
    List<ProductResponse> searchProducts(String name, String category, Double minPrice, Double maxPrice);
}