package com.esempio.Ecommerce.config;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
//
//import java.util.*;
//
//public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
//
//
//    @Override
//    public AbstractAuthenticationToken convert(Jwt jwt) {
//        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
//        return new JwtAuthenticationToken(jwt, authorities);
//    }
//
//    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
//        Set<GrantedAuthority> authorities = new HashSet<>();
//
//        // Estrai ruoli dal realm_access.roles
//        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
//        if (realmAccess != null && realmAccess.containsKey("roles")) {
//            @SuppressWarnings("unchecked")
//            List<String> roles = (List<String>) realmAccess.get("roles");
//            roles.forEach(role -> {
//                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
//                // Aggiungere l'autorità senza prefisso se vuoi renderla disponibile anche così
//                authorities.add(new SimpleGrantedAuthority(role));
//            });
//        }
//
//        // Estrai ruoli anche dal resource_access per ogni client (se necessario)
//        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
//        if (resourceAccess != null) {
//            resourceAccess.forEach((clientId, access) -> {
//                if (access instanceof Map) {
//                    @SuppressWarnings("unchecked")
//                    Map<String, Object> clientAccess = (Map<String, Object>) access;
//                    if (clientAccess.containsKey("roles")) {
//                        @SuppressWarnings("unchecked")
//                        List<String> clientRoles = (List<String>) clientAccess.get("roles");
//                        clientRoles.forEach(role -> {
//                            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
//                            authorities.add(new SimpleGrantedAuthority(role));
//                        });
//                    }
//                }
//            });
//        }
//
//        return authorities;
//    }
//}



import com.esempio.Ecommerce.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toSet;
@Component
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserServiceImpl userServiceImpl;

    @Autowired
    public KeycloakJwtAuthenticationConverter(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }
    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt source) {
        return new JwtAuthenticationToken(
                source,
                Stream.concat(
                                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                                extractResourceRoles(source).stream())
                        .collect(toSet()));
    }



    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {

        Map<String, Object> claims = jwt.getClaims();
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");
        if (realmAccess != null) {
            List<String> realmRoles = (List<String>) realmAccess.get("roles");
            if (realmRoles != null) {
                authorities.addAll(realmRoles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList()));
            }
        }

        // Estrai i ruoli dal campo "resource_access"
        Map<String, Object> resourceAccess = (Map<String, Object>) claims.get("resource_access");
        if (resourceAccess != null) {
            resourceAccess.forEach((resource, rolesObj) -> {
                Map<String, Object> rolesMap = (Map<String, Object>) rolesObj;
                List<String> roles = (List<String>) rolesMap.get("roles");
                if (roles != null) {
                    authorities.addAll(roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .collect(Collectors.toList()));
                }
            });
        }
        return authorities;
    }
}