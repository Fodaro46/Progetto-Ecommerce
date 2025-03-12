package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.domain.entity.LocalUser;
import com.esempio.Ecommerce.api.repository.LocalUserRepository;
import com.esempio.Ecommerce.service.UserService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final LocalUserRepository localUserRepository;

    // Costruttore semplificato con solo le dipendenze necessarie
    public UserServiceImpl(LocalUserRepository localUserRepository) {
        this.localUserRepository = localUserRepository;
    }

    @Override
    public LocalUser registerOrUpdateUser(Jwt jwtToken) {
        String keycloakId = jwtToken.getClaimAsString("sub");
        Optional<LocalUser> existingUser = localUserRepository.findById(keycloakId);

        LocalUser user = existingUser.orElseGet(LocalUser::new);

        // Mappatura campi da Keycloak
        user.setId(keycloakId);
        user.setEmail(jwtToken.getClaimAsString("email"));
        user.setFirstName(jwtToken.getClaimAsString("given_name"));
        user.setLastName(jwtToken.getClaimAsString("family_name"));
        // Campi aggiuntivi se necessario
        // user.setProfilePicture(jwtToken.getClaimAsString("picture"));

        return localUserRepository.save(user);
    }

    @Override
    public LocalUser registerUser(Jwt jwtToken) {
        String keycloakId = jwtToken.getClaimAsString("sub");
        Optional<LocalUser> existingUser = localUserRepository.findById(keycloakId);

        if (existingUser.isPresent()) {
            throw new RuntimeException("Utente già registrato");
        }

        LocalUser user = new LocalUser();

        // Mappatura campi da Keycloak
        user.setId(keycloakId);
        user.setEmail(jwtToken.getClaimAsString("email"));
        user.setFirstName(jwtToken.getClaimAsString("given_name"));
        user.setLastName(jwtToken.getClaimAsString("family_name"));

        return localUserRepository.save(user);
    }

    @Override
    public Optional<LocalUser> findLocalUserById(String userId) {
        return localUserRepository.findById(userId);
    }

    @Override
    public Optional<LocalUser> findLocalUserByEmail(String email) {
        return localUserRepository.findByEmailIgnoreCase(email);
    }
}