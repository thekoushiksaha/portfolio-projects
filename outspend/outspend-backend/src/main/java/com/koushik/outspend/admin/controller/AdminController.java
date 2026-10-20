package com.koushik.outspend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.outspend.admin.model.ContactMessageResponse;
import com.koushik.outspend.admin.service.AdminService;
import com.koushik.outspend.common.response.ApiResponse;
import com.koushik.outspend.common.response.PageResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only endpoints")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "List contact messages, newest first")
    @GetMapping("/contact-messages")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> contactMessage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity
                .ok(ApiResponse.ok("Contact messages loaded", adminService.listContactMessages(page, size)));
    }

}
