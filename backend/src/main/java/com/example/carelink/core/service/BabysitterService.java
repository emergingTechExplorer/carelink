package com.example.carelink.core.service;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.BabySitterPatchDto;
import com.example.carelink.core.payload.request.BabysitterSearchRequest;

public interface BabysitterService {

    ResponseEntityDto updateBabysitter(Long userId, BabySitterPatchDto babySitterPatchDto);

    ResponseEntityDto getAllBabysitters();

    ResponseEntityDto getBabysitterByUserId(Long userId);

    ResponseEntityDto searchBabysitters(BabysitterSearchRequest request);
}
