package com.koushik.outspend.expense.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.koushik.outspend.expense.entity.Category;

public record ExpenseResponse(
        Long id,
        BigDecimal amount,
        Category category,
        LocalDate expenseDate,
        String note,
        Instant createdAt) {

}
