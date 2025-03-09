package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
