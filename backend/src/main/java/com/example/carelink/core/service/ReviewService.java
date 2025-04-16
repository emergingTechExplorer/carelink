package com.example.carelink.core.service;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.ReviewRequestDto;

public interface ReviewService {

    ResponseEntityDto addReview(ReviewRequestDto request);

    ResponseEntityDto getReviewsByBabysitterId(Long babysitterId);
}

