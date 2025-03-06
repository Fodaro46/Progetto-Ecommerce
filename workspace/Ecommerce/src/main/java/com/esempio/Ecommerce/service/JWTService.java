package com.esempio.Ecommerce.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.esempio.Ecommerce.model.Entity.LocalUser;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class JWTService {
    @Value("${jwt.algorithm.key}")
    private String algorithmKey;
    @Value("${jwt.issuer}")
    private String issuer;
    @Value("${jwt.expiryInSeconds}")
    private int expiryInSeconds;
    private Algorithm algorithm;
    private static final String USERNAME_KEY = "USERNAME";
    private static final String ROLES_KEY = "roles"; // Chiave dei ruoli

    @PostConstruct
    public void postConstruct() {
        algorithm = Algorithm.HMAC256(algorithmKey);
    }

    /**
     * Genera un JWT basato su utente utilizzatore
     *
     * @param user
     * @return JWT
     */
    public String generateJWT(LocalUser user) {
        return JWT.create()
                .withClaim(USERNAME_KEY, user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + (expiryInSeconds * 1000L)))
                .withIssuer(issuer)
                .sign(algorithm);
    }

    /**
     * Estrae il nome utente dal token JWT
     *
     * @param token
     * @return Nome utente
     */
    public String getUsername(String token) {
        return JWT.decode(token).getClaim(USERNAME_KEY).asString();
    }

    /**
     * Estrae i ruoli dal token JWT
     *
     * @param token
     * @return Lista di ruoli
     */
    public List<String> getRoles(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim(ROLES_KEY).asList(String.class);
    }

    /**
     * Estrae i ruoli del realm dal token JWT
     *
     * @param token
     * @return Lista di ruoli del realm
     */
    public List<String> getRealmRoles(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim("realm_access.roles").asList(String.class);
    }

    /**
     * Estrae i ruoli delle risorse dal token JWT
     *
     * @param token
     * @return Lista di ruoli delle risorse
     */
    public List<String> getResourceRoles(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim("resource_access.vercarix-rest-api.roles").asList(String.class);
    }
}
