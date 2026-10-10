package com.koushik.outspend.publicapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.outspend.common.response.ApiResponse;
import com.koushik.outspend.publicapi.model.ContactRequest;
import com.koushik.outspend.publicapi.service.PublicService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public/contact")
@RequiredArgsConstructor
public class ContactController {
    public final PublicService publicService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submit(@Valid @RequestBody ContactRequest request) {
        publicService.submitContact(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thanks! Your message has been received"));
    }
}
