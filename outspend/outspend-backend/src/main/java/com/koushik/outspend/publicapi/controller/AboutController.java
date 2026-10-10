package com.koushik.outspend.publicapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.outspend.common.response.ApiResponse;
import com.koushik.outspend.publicapi.model.AboutResponse;
import com.koushik.outspend.publicapi.service.PublicService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public/about")
@RequiredArgsConstructor
public class AboutController {
    private final PublicService publicService;

    @GetMapping
    public ResponseEntity<ApiResponse<AboutResponse>> about() {
        return ResponseEntity.ok(ApiResponse.ok("About loaded", publicService.getAbout()));
    }
}
