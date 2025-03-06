package com.esempio.Ecommerce.api.controller.user;

import com.esempio.Ecommerce.model.Entity.LocalUser;
import com.esempio.Ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
        return ResponseEntity.ok(userService.registerUser(tokenuser));
    }
}
