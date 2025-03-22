package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.domain.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> getProducts();
    void updateProductQuantity(Long productId, int newQuantity);
    ProductResponse addProduct(ProductRequest productRequest);

}