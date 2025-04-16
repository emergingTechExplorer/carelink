package com.example.carelink.core.payload.request;

import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BabySitterPatchDto {
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
    private String location;
    private int age;
}
