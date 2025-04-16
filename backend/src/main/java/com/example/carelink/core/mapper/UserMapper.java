package com.example.carelink.core.mapper;

import com.example.carelink.core.model.User;
import com.example.carelink.core.payload.response.AuthResponseDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AuthResponseDto userToAuthResponseDto(User user, String token) {
        AuthResponseDto authResponseDto = new AuthResponseDto();
        authResponseDto.setId(user.getId());
        authResponseDto.setFirstName(user.getFirstName());
        authResponseDto.setLastName(user.getLastName());
        authResponseDto.setEmail(user.getEmail());
       authResponseDto.setRole(user.getRole());
        authResponseDto.setToken(token);
        return authResponseDto;
    }

}
