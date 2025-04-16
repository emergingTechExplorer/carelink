package com.example.carelink.core.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ReviewResponseDto {

    private int rating;

    private String comment;

    private String parentName;

    private LocalDate reviewDate;

}
