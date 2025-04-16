package com.example.carelink.controller;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.SigninRequest;
import com.example.carelink.core.payload.request.SignupRequest;
import com.example.carelink.core.service.AuthService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    @NonNull
    private final AuthService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<ResponseEntityDto> signup(@RequestBody SignupRequest request) {
        ResponseEntityDto response = authenticationService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<ResponseEntityDto> signin(@RequestBody SigninRequest request) {
        ResponseEntityDto response = authenticationService.signin(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
