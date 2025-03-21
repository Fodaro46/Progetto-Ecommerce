package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.Cart;
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
    Optional<Cart> findByUserIdAndIsActiveTrue(String userId);
}

