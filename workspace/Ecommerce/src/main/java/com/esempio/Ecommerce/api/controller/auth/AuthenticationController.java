package com.esempio.Ecommerce.api.controller.auth;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.text.ParseException;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final RestTemplate restTemplate;
    private final String JWKS_URL = "http://localhost:8080/realms/Vercarix/protocol/openid-connect/certs";

    public AuthenticationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            // Verifica scadenza token
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            if (claims.getExpirationTime().before(new Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }

            if (!verifyTokenSignature(signedJWT)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token signature");
            }

            return ResponseEntity.ok(Map.of(
                    "username", claims.getStringClaim("preferred_username"),
                    "email", claims.getStringClaim("email")
            ));

        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
        } catch (JWTVerificationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error");
        }
    }

    private boolean verifyTokenSignature(SignedJWT signedJWT) throws JWTVerificationException {
        try {
            JWKSet jwkSet = JWKSet.load(URI.create(JWKS_URL).toURL());
            RSAKey rsaKey = (RSAKey) jwkSet.getKeyByKeyId(signedJWT.getHeader().getKeyID());

            if (rsaKey == null) {
                throw new JWTVerificationException("Invalid key ID");
            }

            JWSVerifier verifier = new RSASSAVerifier(rsaKey.toRSAPublicKey());
            return signedJWT.verify(verifier);
        } catch (Exception e) {
            throw new JWTVerificationException("Signature verification failed: " + e.getMessage());
        }
    }

    // Aggiungi questa classe in un file separato o nella parte inferiore
    private static class JWTVerificationException extends Exception {
        public JWTVerificationException(String message) {
            super(message);
        }
    }
}