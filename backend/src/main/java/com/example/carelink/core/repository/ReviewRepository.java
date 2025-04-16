package com.example.carelink.core.repository;

import com.example.carelink.core.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBabysitterIdAndParentId(Long babysitterId, Long parentId);

}
