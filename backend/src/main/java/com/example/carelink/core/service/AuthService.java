package com.example.carelink.core.service;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.SigninRequest;
import com.example.carelink.core.payload.request.SignupRequest;

public interface AuthService {

    ResponseEntityDto signup(SignupRequest request);

    ResponseEntityDto signin(SigninRequest request);
}

