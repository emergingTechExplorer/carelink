package com.example.carelink.core.service.impl;

import com.example.carelink.core.exception.ModuleException;
import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.model.Review;
import com.example.carelink.core.model.User;
import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.ReviewRequestDto;
import com.example.carelink.core.payload.response.ReviewResponseDto;
import com.example.carelink.core.repository.BabysitterDao;
import com.example.carelink.core.repository.ReviewRepository;
import com.example.carelink.core.repository.UserRepository;
import com.example.carelink.core.service.ReviewService;
import com.example.carelink.core.service.UserService;
import com.example.carelink.core.type.Role;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    @NonNull
    private final ReviewRepository reviewRepository;

    @NonNull
    private final BabysitterDao babysitterDao;

    @NonNull
    private final UserRepository userRepository;

    @NonNull
    private final UserService userService;

    @Override
    public ResponseEntityDto addReview(ReviewRequestDto request) {
        Babysitter babysitter = babysitterDao.findByUserId(request.getBabysitterId())
                .orElseThrow(() -> new ModuleException("Babysitter not found"));

        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole().equals(Role.BABYSITTER)) {
            throw new ModuleException("Only parents can add reviews!");
        }

        User parent = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ModuleException("Parent not found"));

//        boolean alreadyReviewed = reviewRepository.existsByBabysitterIdAndParentId(
//                babysitter.getId(), parent.getId()
//        );
//        if (alreadyReviewed) {
//            throw new ModuleException("You have already submitted a review for this babysitter.");
//        }

        Review review = new Review();
        review.setBabysitter(babysitter);
        review.setParent(parent);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        return new ResponseEntityDto(false, "Review added successfully");
    }

    @Override
    public ResponseEntityDto getReviewsByBabysitterId(Long babysitterId) {
        Babysitter babysitter = babysitterDao.findById(babysitterId)
                .orElseThrow(() -> new ModuleException("Babysitter not found"));

        List<Review> reviews = babysitter.getReviews();

        List<ReviewResponseDto> reviewDtos = reviews.stream().map(review -> {
            ReviewResponseDto dto = new ReviewResponseDto();
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setReviewDate(review.getReviewDate());

            User parent = review.getParent();
            dto.setParentName(parent.getFirstName() + " " + parent.getLastName());

            return dto;
        }).toList();

        return new ResponseEntityDto(false, reviewDtos);
    }

}

