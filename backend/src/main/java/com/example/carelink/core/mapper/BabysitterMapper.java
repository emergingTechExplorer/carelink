package com.example.carelink.core.mapper;

import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.model.Review;
import com.example.carelink.core.payload.response.BabysitterResponseDto;
import com.example.carelink.core.payload.response.ReviewResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BabysitterMapper {

    public BabysitterResponseDto toResponseDto(Babysitter babysitter) {
        BabysitterResponseDto dto = new BabysitterResponseDto();

        dto.setUserId(babysitter.getUser().getId());
        dto.setFirstName(babysitter.getUser().getFirstName());
        dto.setLastName(babysitter.getUser().getLastName());
        dto.setEmail(babysitter.getUser().getEmail());
        dto.setRole(babysitter.getUser().getRole());

        dto.setPhone(babysitter.getPhone());
        dto.setAddress(babysitter.getAddress());
        dto.setQualifications(babysitter.getQualifications());
        dto.setExperienceInYears(babysitter.getExperienceInYears());
        dto.setHourlyRate(babysitter.getHourlyRate());
        dto.setAvailabilityDays(babysitter.getAvailabilityDays());
        dto.setAvailabilityTimeRange(babysitter.getAvailabilityTimeRange());
        dto.setBio(babysitter.getBio());
        dto.setLicenseNumber(babysitter.getLicenseNumber());
        dto.setProfileImageUrl(babysitter.getProfileImageUrl());
        dto.setLocation(babysitter.getLocation());
        dto.setAge(babysitter.getAge());

        if (babysitter.getReviews() != null && !babysitter.getReviews().isEmpty()) {
            List<ReviewResponseDto> reviews = babysitter.getReviews().stream()
                    .map(this::mapReview)
                    .collect(Collectors.toList());
            dto.setReviews(reviews);
        }

        return dto;
    }

    private ReviewResponseDto mapReview(Review review) {
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());

        if (review.getParent() != null) {
            dto.setParentName(review.getParent().getFirstName() + " " + review.getParent().getLastName());
        }

        dto.setReviewDate(review.getReviewDate());
        return dto;
    }
}
