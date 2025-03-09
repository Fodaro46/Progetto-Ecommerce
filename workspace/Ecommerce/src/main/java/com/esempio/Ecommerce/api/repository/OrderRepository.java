package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderItem, Long> {

}
