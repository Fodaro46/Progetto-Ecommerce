package com.esempio.Ecommerce.model.repository;

import com.esempio.Ecommerce.model.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
