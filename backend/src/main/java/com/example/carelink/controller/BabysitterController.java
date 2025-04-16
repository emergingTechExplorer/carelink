package com.example.carelink.controller;

import com.example.carelink.core.payload.common.ResponseEntityDto;
import com.example.carelink.core.payload.request.BabySitterPatchDto;
import com.example.carelink.core.payload.request.BabysitterSearchRequest;
import com.example.carelink.core.service.BabysitterService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/babysitters")
@RequiredArgsConstructor
public class BabysitterController {

    @NonNull
    private final BabysitterService babysitterService;

    @PatchMapping("/{userId}")
    public ResponseEntity<ResponseEntityDto> updateBabysitter(@PathVariable("userId") Long userId, @RequestBody BabySitterPatchDto babySitterPatchDto) {
        ResponseEntityDto response = babysitterService.updateBabysitter(userId, babySitterPatchDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseEntityDto> getAllBabysitters() {
        ResponseEntityDto response = babysitterService.getAllBabysitters();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseEntityDto> getBabysitterByUserId(@PathVariable Long userId) {
        ResponseEntityDto response = babysitterService.getBabysitterByUserId(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseEntityDto> searchBabysitters(@RequestBody BabysitterSearchRequest request) {
        ResponseEntityDto response = babysitterService.searchBabysitters(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
