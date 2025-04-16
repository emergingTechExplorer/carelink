package com.example.carelink.core.payload.request;

import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BabysitterSearchRequest {
    private Double minRate;
    private Double maxRate;
    private List<WeekDay> availableDays;
    private TimeSlot timeSlot;
    private String location;
    private Integer childAge;
}
