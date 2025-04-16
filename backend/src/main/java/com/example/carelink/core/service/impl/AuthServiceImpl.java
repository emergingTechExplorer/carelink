package com.example.carelink.core.service.impl;

import com.example.carelink.core.exception.ModuleException;
import com.example.carelink.core.mapper.UserMapper;
import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.model.User;
import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.SigninRequest;
import com.example.carelink.core.payload.request.SignupRequest;
import com.example.carelink.core.payload.response.AuthResponseDto;
import com.example.carelink.core.repository.BabysitterDao;
import com.example.carelink.core.repository.UserRepository;
import com.example.carelink.core.service.AuthService;
import com.example.carelink.core.service.JwtService;
import com.example.carelink.core.type.Role;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @NonNull
    private final PasswordEncoder passwordEncoder;

    @NonNull
    private final AuthenticationManager authenticationManager;

    @NonNull
    private final JwtService jwtService;

    @NonNull
    private final UserRepository userRepository;

    @NonNull
    private final UserMapper userMapper;

    @NonNull
    private final BabysitterDao babysitterDao;

    @Override
    public ResponseEntityDto signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ModuleException("Email already exists. Please use a different email.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        if (request.getRole() == Role.BABYSITTER) {
            Babysitter babysitter = new Babysitter();
            babysitter.setUser(user);
            babysitterDao.save(babysitter);
        }

        String jwt = jwtService.generateToken(user);
        AuthResponseDto authResponseDto = userMapper.userToAuthResponseDto(user, jwt);

        return new ResponseEntityDto(false, authResponseDto);
    }

    @Override
    public ResponseEntityDto signin(SigninRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User login failed!"));

        String jwt = jwtService.generateToken(user);
        AuthResponseDto authResponseDto = userMapper.userToAuthResponseDto(user, jwt);

        return new ResponseEntityDto(false, authResponseDto);
    }

}
