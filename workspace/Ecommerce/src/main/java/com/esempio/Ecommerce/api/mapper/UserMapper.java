
// UserMapper.java
package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.UserRequest;
import com.esempio.Ecommerce.api.dto.response.UserResponse;
import com.esempio.Ecommerce.domain.entity.LocalUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    UserResponse toDto(LocalUser user);

    List<UserResponse> toDtoList(List<LocalUser> users);

    @Mapping(target = "id", expression = "java(generateUserId())")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LocalUser toEntity(UserRequest userRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", source = "email")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUser(UserRequest userRequest, @MappingTarget LocalUser user);

    default String generateUserId() {
        return UUID.randomUUID().toString();
    }
}