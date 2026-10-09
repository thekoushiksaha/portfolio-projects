package com.koushik.outspend.limit.model;

import java.math.BigDecimal;

import com.koushik.outspend.expense.entity.Category;

public record LimitResponse(
        Long id,
        Category category,
        BigDecimal monthlyLimit,
        BigDecimal spent,
        BigDecimal remaining,
        BigDecimal percentUsed,
        LimitStatus status) {

}
