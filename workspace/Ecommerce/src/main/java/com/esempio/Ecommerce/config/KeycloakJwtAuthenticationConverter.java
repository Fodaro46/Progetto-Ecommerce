package com.esempio.Ecommerce.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Estrai ruoli dal realm_access.roles
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");

            // Aggiungi sia il formato "ROLE_rolename" che "rolename" per compatibilità
            roles.forEach(role -> {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                authorities.add(new SimpleGrantedAuthority(role));
            });
        }

        // Estrai ruoli dal resource_access.{client-id}.roles
        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
        if (resourceAccess != null) {
            resourceAccess.forEach((clientId, access) -> {
                if (access instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> clientAccess = (Map<String, Object>) access;
                    if (clientAccess.containsKey("roles")) {
                        @SuppressWarnings("unchecked")
                        List<String> clientRoles = (List<String>) clientAccess.get("roles");

                        // Aggiungi sia con prefisso che senza
                        clientRoles.forEach(role -> {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                            authorities.add(new SimpleGrantedAuthority(role));
                        });
                    }
                }
            });
        }

        return authorities;
    }
}