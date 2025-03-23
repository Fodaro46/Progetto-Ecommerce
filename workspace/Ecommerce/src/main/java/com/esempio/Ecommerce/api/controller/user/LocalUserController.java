package com.esempio.Ecommerce.api.controller.user;

import com.esempio.Ecommerce.api.dto.request.UserRequest;
import com.esempio.Ecommerce.domain.entity.LocalUser;
import com.esempio.Ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/localuser")
public class LocalUserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@AuthenticationPrincipal Jwt tokenuser) {
        String keycloakId=tokenuser.getClaimAsString("sub");
        Optional<LocalUser> l = userService.findLocalUserById(keycloakId);
        if(l.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Utente già registrato");
        }
        return ResponseEntity.ok(userService.registerOrUpdateUser(tokenuser));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Qui non facciamo altro che inviare una risposta per indicare il logout
        return ResponseEntity.ok("Logout effettuato con successo. Rimuovi il token dal client.");
    }
    @GetMapping("/me")
    public ResponseEntity<LocalUser> getCurrentUser(@AuthenticationPrincipal Jwt tokenUser) {
        String keycloakId = tokenUser.getClaimAsString("sub");
        Optional<LocalUser> userOpt = userService.findLocalUserById(keycloakId);
        return userOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<LocalUser> updateCurrentUser(
            @AuthenticationPrincipal Jwt tokenUser,
            @Valid @RequestBody UserRequest updateRequest) {
        String keycloakId = tokenUser.getClaimAsString("sub");
        LocalUser updatedUser = userService.updateUser(keycloakId, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
}
