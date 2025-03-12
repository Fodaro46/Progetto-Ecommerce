package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.domain.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> getProducts();
    void updateProductQuantity(Long productId, int newQuantity);
}