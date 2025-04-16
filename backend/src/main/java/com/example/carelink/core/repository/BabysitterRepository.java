package com.example.carelink.core.repository;

import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;

import java.util.List;

public interface BabysitterRepository {

    List<Babysitter> advancedSearch(Double minRate, Double maxRate, TimeSlot timeSlot, List<WeekDay> availableDays, String location);
}
