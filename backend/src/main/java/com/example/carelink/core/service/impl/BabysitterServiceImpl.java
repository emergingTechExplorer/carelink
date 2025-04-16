package com.example.carelink.core.service.impl;

import com.example.carelink.core.exception.ModuleException;
import com.example.carelink.core.mapper.BabysitterMapper;
import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.BabySitterPatchDto;
import com.example.carelink.core.payload.request.BabysitterSearchRequest;
import com.example.carelink.core.payload.response.BabysitterResponseDto;
import com.example.carelink.core.repository.BabysitterDao;
import com.example.carelink.core.service.BabysitterService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BabysitterServiceImpl implements BabysitterService {

    @NonNull
    private final BabysitterDao babysitterDao;

    @NonNull
    private final BabysitterMapper babysitterMapper;

    @Override
    public ResponseEntityDto updateBabysitter(Long userId, BabySitterPatchDto dto) {
        return babysitterDao.findByUserId(userId)
                .map(babysitter -> {
                    babysitter.setPhone(dto.getPhone());
                    babysitter.setAddress(dto.getAddress());
                    babysitter.setQualifications(dto.getQualifications());
                    babysitter.setExperienceInYears(dto.getExperienceInYears());
                    babysitter.setHourlyRate(dto.getHourlyRate());
                    babysitter.setAvailabilityDays(dto.getAvailabilityDays());
                    babysitter.setAvailabilityTimeRange(dto.getAvailabilityTimeRange());
                    babysitter.setBio(dto.getBio());
                    babysitter.setLicenseNumber(dto.getLicenseNumber());
                    babysitter.setProfileImageUrl(dto.getProfileImageUrl());
                    babysitter.setLocation(dto.getLocation());
                    babysitter.setAge(dto.getAge());

                    babysitterDao.save(babysitter);

                    return new ResponseEntityDto(false, "Babysitter profile updated successfully.");
                })
                .orElseThrow(() -> new ModuleException("Babysitter not found!")
                );
    }

    @Override
    public ResponseEntityDto getAllBabysitters() {
        List<Babysitter> babysitters = babysitterDao.findAll();

        List<BabysitterResponseDto> babysitterDtos = babysitters.stream()
                .map(babysitterMapper::toResponseDto)
                .collect(Collectors.toList());

        return new ResponseEntityDto(false, babysitterDtos);
    }

    @Override
    public ResponseEntityDto getBabysitterByUserId(Long userId) {
        return babysitterDao.findByUserId(userId)
                .map(babysitter -> {
                    BabysitterResponseDto dto = babysitterMapper.toResponseDto(babysitter);
                    return new ResponseEntityDto(false, dto);
                })
                .orElseThrow(() -> new ModuleException("Babysitter not found!"));
    }

    @Override
    public ResponseEntityDto searchBabysitters(BabysitterSearchRequest request) {
        List<Babysitter> babysitters = babysitterDao.advancedSearch(
                request.getMinRate(),
                request.getMaxRate(),
                request.getTimeSlot(),
                request.getAvailableDays(),
                request.getLocation()
        );

        List<BabysitterResponseDto> results = babysitters.stream()
                .map(babysitterMapper::toResponseDto)
                .collect(Collectors.toList());

        return new ResponseEntityDto(false, results);
    }

}
