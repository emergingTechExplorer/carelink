package com.example.carelink.core.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDto {

    private Long babysitterId;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;
}
