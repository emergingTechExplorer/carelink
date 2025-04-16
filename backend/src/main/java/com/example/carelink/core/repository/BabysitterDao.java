package com.example.carelink.core.repository;

import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BabysitterDao extends JpaRepository<Babysitter, Long>, JpaSpecificationExecutor<Babysitter>, BabysitterRepository {

    Optional<Babysitter> findByUserId(Long userId);

}
