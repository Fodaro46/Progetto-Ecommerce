package com.esempio.Ecommerce.model.mapper;


import com.esempio.Ecommerce.api.dto.LoginBody;
import com.esempio.Ecommerce.model.Entity.LocalUser;

public class LoginBodyMapper {

    // Mapper per LoginBody -> LocalUser
    public static LocalUser toLocalUser(LoginBody loginBody) {
        LocalUser localUser = new LocalUser();
        localUser.setUsername(loginBody.getUsername());
        localUser.setPassword(loginBody.getPassword());
        return localUser;
    }

    // Mapper per LocalUser -> LoginBody
    public static LoginBody toLoginBody(LocalUser localUser) {
        LoginBody loginBody = new LoginBody();
        loginBody.setUsername(localUser.getUsername());
        loginBody.setPassword(localUser.getPassword());
        return loginBody;
    }
}
