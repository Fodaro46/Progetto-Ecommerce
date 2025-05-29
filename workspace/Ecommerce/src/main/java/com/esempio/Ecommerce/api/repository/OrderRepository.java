package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.Order;
import com.esempio.Ecommerce.domain.entity.LocalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(LocalUser user);
    List<Order> findAllByOrderByCreatedAtDesc();
}