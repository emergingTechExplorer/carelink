package com.example.carelink.core.payload.request;

import com.example.carelink.core.type.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SignupRequest {

    private String firstName;

    private String lastName;

    @NotNull
    @Email
    private String email;

    private String password;

    private Role role;

}
