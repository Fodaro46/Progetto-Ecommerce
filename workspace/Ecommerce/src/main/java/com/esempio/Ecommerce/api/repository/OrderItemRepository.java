package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.LocalUser;
import com.esempio.Ecommerce.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(LocalUser user); // Trova ordini associati a un utente specifico
}
