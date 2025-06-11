package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.LocalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalUserRepository extends JpaRepository<LocalUser, String> {

    Optional<LocalUser> findByEmailIgnoreCase(String email);
}