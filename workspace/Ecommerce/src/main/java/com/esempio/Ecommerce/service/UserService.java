package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.api.dto.LoginBody;
import com.esempio.Ecommerce.api.dto.RegistrationBody;
import com.esempio.Ecommerce.exception.UserAlreadyExistsException;
import com.esempio.Ecommerce.model.Entity.LocalUser;
import com.esempio.Ecommerce.model.repository.LocalUserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {


    private final LocalUserRepository localUserDAO;
    private final EncryptionService encryptionService;
    private final JWTService jwtService;
    private final LocalUserRepository localUserRepository;

    public UserService(LocalUserRepository localUserDAO, EncryptionService encryptionService, JWTService jwtService, LocalUserRepository localUserRepository) {

        this.localUserDAO = localUserDAO;
        this.encryptionService = encryptionService;
        this.jwtService = jwtService;
        this.localUserRepository = localUserRepository;
    }
    public LocalUser registerUser(Jwt tokenuser){
        String keycloakid = tokenuser.getClaimAsString("sub");
        String email= tokenuser.getClaimAsString("email");
        String first_name= tokenuser.getClaimAsString("given_name");
        String last_name= tokenuser.getClaimAsString("family_name");
        LocalUser l= new LocalUser();
        l.setEmail(email);
        l.setFirstName(first_name);
        l.setLastName(last_name);
        l.setId(keycloakid);
        return localUserRepository.save(l);
    }
    public String loginUser(LoginBody loginBody){
        Optional<LocalUser> opUser = localUserDAO.findByUsernameIgnoreCase(loginBody.getUsername());
        if(opUser.isPresent()){
            LocalUser user = opUser.get();
            if(encryptionService.checkPassword(loginBody.getPassword(), user.getPassword())){
                return jwtService.generateJWT(user);
            }
        }
        return null;
    }
    public Optional<LocalUser>findLocalUserById(String userId){
        return localUserRepository.findById(userId);
    }
}
