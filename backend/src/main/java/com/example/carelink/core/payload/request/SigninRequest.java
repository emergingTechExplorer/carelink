package com.example.carelink.core.payload.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SigninRequest {

    private String email;

    private String password;

}
