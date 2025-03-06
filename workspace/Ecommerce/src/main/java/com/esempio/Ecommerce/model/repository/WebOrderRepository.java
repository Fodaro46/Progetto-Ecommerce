package com.esempio.Ecommerce.model.repository;

import com.esempio.Ecommerce.model.Entity.LocalUser;
import com.esempio.Ecommerce.model.Entity.WebOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WebOrderRepository extends JpaRepository<WebOrder, Long> {
    List<WebOrder> findByUser(LocalUser user); // Trova ordini associati a un utente specifico
}
