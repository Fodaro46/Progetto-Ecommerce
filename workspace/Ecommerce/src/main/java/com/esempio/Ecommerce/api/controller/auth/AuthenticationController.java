package com.esempio.Ecommerce.api.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUserProfile(@AuthenticationPrincipal Jwt principal) {
        // Usa il token JWT per ottenere le informazioni dell'utente
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Estrai informazioni dal token
        String username = principal.getClaim("preferred_username");
        String email = principal.getClaim("email");
        return ResponseEntity.ok(Map.of("username", username, "email", email));
    }

    // Non necessario implementare /login o /register
    // Keycloak gestisce già il login e la registrazione

    // Endpoint per il logout
    @GetMapping("/logout")
    public String logout(@AuthenticationPrincipal Jwt authentication) {
        // Reindirizza a Keycloak per il logout
        String logoutUrl = "http://localhost:8083/realms/Vercarix/protocol/openid-connect/logout?redirect_uri=http://localhost:8083";
        return "Redirecting to logout: " + logoutUrl;
    }
}
