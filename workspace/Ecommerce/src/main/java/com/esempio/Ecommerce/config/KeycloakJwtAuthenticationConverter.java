package com.esempio.Ecommerce.config;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import com.esempio.Ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static java.util.stream.Collectors.toSet;

@Component
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

    @Autowired
    public KeycloakJwtAuthenticationConverter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt source) {
        {
            return new JwtAuthenticationToken(
                    source,
                    Stream.concat(
                                    new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                                    extractResourceRoles(source).stream())
                            .collect(toSet()));
        }
    }
        private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt){

            Map<String, Object> claims = jwt.getClaims();
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realmaccess");
            if (realmAccess != null) {
                List<String> realmRoles = (List<String>) realmAccess.get("roles");
                if (realmRoles != null) {
                    authorities.addAll(realmRoles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE" + role))
                            .collect(Collectors.toList()));
                }
            }

            // Estrai i ruoli dal campo "resource_access"
            Map<String, Object> resourceAccess = (Map<String, Object>) claims.get("resourceaccess");
            if (resourceAccess != null) {
                resourceAccess.forEach((resource, rolesObj) -> {
                    Map<String, Object> rolesMap = (Map<String, Object>) rolesObj;
                    List<String> roles = (List<String>) rolesMap.get("roles");
                    if (roles != null) {
                        authorities.addAll(roles.stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE" + role))
                                .collect(Collectors.toList()));
                    }
                });
            }
            return authorities;
        }
    }