package com.esempio.Ecommerce.model.repository;

import com.esempio.Ecommerce.model.Entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Trova un carrello attivo associato a un utente specifico.
     *
     * @param userId l'ID dell'utente
     * @return un Optional contenente il carrello attivo, se presente.
     */
    Optional<Cart> findByUserIdAndIsActiveTrue(Long userId);
}

