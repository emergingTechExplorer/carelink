package com.example.carelink.core.repository;

import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class BabysitterRepositoryImpl implements BabysitterRepository {

    @NonNull
    private final EntityManager entityManager;

    @Override
    public List<Babysitter> advancedSearch(Double minRate, Double maxRate, TimeSlot timeSlot, List<WeekDay> availableDays, String location) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Babysitter> query = cb.createQuery(Babysitter.class);
        Root<Babysitter> babysitter = query.from(Babysitter.class);

        List<Predicate> predicates = new ArrayList<>();

        if (minRate != null) {
            predicates.add(cb.gt(babysitter.get("hourlyRate"), minRate));
        }

        if (maxRate != null) {
            predicates.add(cb.lt(babysitter.get("hourlyRate"), maxRate));
        }

        if (timeSlot != null) {
            predicates.add(cb.equal(babysitter.get("availabilityTimeRange"), timeSlot));
        }

        if (location != null && !location.isBlank()) {
            predicates.add(cb.like(cb.lower(babysitter.get("location")),
                    "%" + location.toLowerCase() + "%"));
        }

        if (availableDays != null && !availableDays.isEmpty()) {
            Join<Babysitter, WeekDay> daysJoin = babysitter.join("availabilityDays", JoinType.LEFT);
            predicates.add(daysJoin.in(availableDays));
        }

        query.select(babysitter).distinct(true);
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(query).getResultList();
    }

}
