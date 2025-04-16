package com.example.carelink.core.payload.response;

import com.example.carelink.core.type.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponseDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

    private String token;

}

