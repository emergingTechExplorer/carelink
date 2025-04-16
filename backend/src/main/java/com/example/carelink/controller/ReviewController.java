package com.example.carelink.controller;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.ReviewRequestDto;
import com.example.carelink.core.service.ReviewService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    @NonNull
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ResponseEntityDto> addReview(@RequestBody ReviewRequestDto request) {
        ResponseEntityDto response = reviewService.addReview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/babysitter/{babysitterId}")
    public ResponseEntity<ResponseEntityDto> getReviewsByBabysitterId(@PathVariable Long babysitterId) {
        ResponseEntityDto response = reviewService.getReviewsByBabysitterId(babysitterId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
