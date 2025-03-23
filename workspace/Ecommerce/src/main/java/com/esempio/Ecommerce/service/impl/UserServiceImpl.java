package com.esempio.Ecommerce.service.impl;

import com.esempio.Ecommerce.api.dto.request.UserRequest;
import com.esempio.Ecommerce.domain.entity.LocalUser;
import com.esempio.Ecommerce.api.repository.LocalUserRepository;
import com.esempio.Ecommerce.service.CartService;
import com.esempio.Ecommerce.service.UserService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final LocalUserRepository localUserRepository;
    private final CartService cartService;

    // Costruttore semplificato con solo le dipendenze necessarie
    public UserServiceImpl(LocalUserRepository localUserRepository, CartService cartService) {
        this.localUserRepository = localUserRepository;
        this.cartService = cartService;
    }

    @Override
    public LocalUser registerOrUpdateUser(Jwt jwtToken) {
        String keycloakId = jwtToken.getClaimAsString("sub");
        Optional<LocalUser> existingUser = localUserRepository.findById(keycloakId);

        // Assicurati che l'utente stia aggiornando solo i suoi dati
        if (existingUser.isEmpty()) {
            // Registrazione di un nuovo utente
            LocalUser newUser = createNewUserFromToken(jwtToken);
            localUserRepository.save(newUser);

            // Crea un carrello per il nuovo utente
            cartService.createNewCart(keycloakId);  // Usa cartService per creare un nuovo carrello
            return newUser;
        } else {
            // Aggiornamento di un utente esistente
            LocalUser user = existingUser.get();
            updateUserWithTokenData(user, jwtToken);
            return localUserRepository.save(user);
        }
    }

    private LocalUser createNewUserFromToken(Jwt jwtToken) {
        LocalUser user = new LocalUser();
        user.setId(jwtToken.getClaimAsString("sub"));
        user.setEmail(jwtToken.getClaimAsString("email"));
        user.setFirstName(jwtToken.getClaimAsString("given_name"));
        user.setLastName(jwtToken.getClaimAsString("family_name"));
        return user;
    }

    private void updateUserWithTokenData(LocalUser user, Jwt jwtToken) {
        user.setEmail(jwtToken.getClaimAsString("email"));
        user.setFirstName(jwtToken.getClaimAsString("given_name"));
        user.setLastName(jwtToken.getClaimAsString("family_name"));
    }

    @Override
    public Optional<LocalUser> findLocalUserById(String userId) {
        return localUserRepository.findById(userId);
    }

    @Override
    public Optional<LocalUser> findLocalUserByEmail(String email) {
        return localUserRepository.findByEmailIgnoreCase(email);
    }

    @Override
    @Transactional
    public LocalUser updateUser(String userId, UserRequest updateRequest) {
        LocalUser user = localUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato: " + userId));
        user.setEmail(updateRequest.email());
        user.setFirstName(updateRequest.firstName());
        user.setLastName(updateRequest.lastName());
        return localUserRepository.save(user);
    }

}
