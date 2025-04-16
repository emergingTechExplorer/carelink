package com.example.carelink.core.service;

import com.example.carelink.core.model.User;
import com.example.carelink.core.payload.common.ResponseEntityDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {

    UserDetailsService userDetailsService();

    User getCurrentUser();

    ResponseEntityDto getMe();
}