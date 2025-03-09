package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.LocalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalUserRepository extends JpaRepository<LocalUser, String> {
    // Rimosso il metodo findByUsernameIgnoreCase che causava l'errore

    Optional<LocalUser> findByEmailIgnoreCase(String email);
}