package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.request.UserRequest;
import com.esempio.Ecommerce.domain.entity.LocalUser;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

public interface UserService {
    LocalUser registerOrUpdateUser(Jwt jwtToken);
    Optional<LocalUser> findLocalUserById(String userId);
    Optional<LocalUser> findLocalUserByEmail(String email);
    LocalUser updateUser(String userId, UserRequest updateRequest);

}
