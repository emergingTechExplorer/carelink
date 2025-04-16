package com.example.carelink.core.payload.response;

import com.example.carelink.core.type.Role;
import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BabysitterResponseDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

    private String phone;
    private String address;
    private String qualifications;
    private Integer experienceInYears;
    private Double hourlyRate;

    private List<WeekDay> availabilityDays;
    private TimeSlot availabilityTimeRange;

    private String bio;
    private String licenseNumber;
    private String profileImageUrl;

    private List<ReviewResponseDto> reviews;

    private String location;

    private int age;
}
