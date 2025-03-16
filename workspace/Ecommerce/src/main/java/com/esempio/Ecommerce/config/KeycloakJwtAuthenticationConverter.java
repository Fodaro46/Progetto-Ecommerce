package com.esempio.Ecommerce.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toSet;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt source) {
        return new JwtAuthenticationToken(
                source,
                Stream.concat(
                                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                                extractResourceRoles(source).stream())
                        .collect(toSet()));
    }

    @SuppressWarnings("unchecked")
    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
        Object resourceAccessObj = jwt.getClaim("resource_access");
        if (!(resourceAccessObj instanceof Map<?, ?>)) {
            return Collections.emptyList();
        }

        Map<String, Object> resourceAccess = (Map<String, Object>) resourceAccessObj;
        Object accountObj = resourceAccess.get("account");
        if (!(accountObj instanceof Map<?, ?>)) {
            return Collections.emptyList();
        }

        Map<String, Object> account = (Map<String, Object>) accountObj;
        Object rolesObj = account.get("roles");
        if (!(rolesObj instanceof List<?>)) {
            return Collections.emptyList();
        }

        List<?> roles = (List<?>) rolesObj;
        return roles.stream()
                .filter(role -> role instanceof String)
                .map(role -> new SimpleGrantedAuthority("ROLE_" + ((String) role).replace("-", "_")))
                .collect(toSet());
    }
}
