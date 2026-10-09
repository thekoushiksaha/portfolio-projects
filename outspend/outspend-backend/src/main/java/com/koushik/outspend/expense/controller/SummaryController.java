package com.koushik.outspend.expense.controller;

import java.time.YearMonth;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koushik.outspend.common.response.ApiResponse;
import com.koushik.outspend.expense.model.MonthTotal;
import com.koushik.outspend.expense.model.SummaryResponse;
import com.koushik.outspend.expense.service.SummaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/summary")
@RequiredArgsConstructor
public class SummaryController {
    private final SummaryService summaryService;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<SummaryResponse>> monthly(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return ResponseEntity.ok(ApiResponse.ok("Summary loaded", summaryService.monthly(month)));
    }

    @GetMapping("/trend")
    public ResponseEntity<ApiResponse<List<MonthTotal>>> trend(
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(ApiResponse.ok("Trend loaded", summaryService.trend(months)));
    }

}
