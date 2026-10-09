package com.koushik.outspend.limit.controller;

import java.time.YearMonth;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.outspend.common.response.ApiResponse;
import com.koushik.outspend.limit.model.LimitRequest;
import com.koushik.outspend.limit.model.LimitResponse;
import com.koushik.outspend.limit.service.LimitService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/limits")
@RequiredArgsConstructor
public class LimitController {
    private final LimitService limitService;

    @PutMapping
    public ResponseEntity<ApiResponse<LimitResponse>> save(@Valid @RequestBody LimitRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Limit saved", limitService.save(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LimitResponse>>> list(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return ResponseEntity.ok(ApiResponse.ok("Limits loaded", limitService.list(month)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        limitService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Limit deleted"));
    }
}
