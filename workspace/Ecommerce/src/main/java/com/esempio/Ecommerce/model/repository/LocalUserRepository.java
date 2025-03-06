package com.esempio.Ecommerce.model.repository;

import com.esempio.Ecommerce.model.Entity.LocalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface LocalUserRepository extends JpaRepository<LocalUser, String> {

    Optional<LocalUser> findByUsernameIgnoreCase(String username);

    Optional<LocalUser> findByEmailIgnoreCase(String email);
}
