package com.koushik.outspend.expense.model;

import java.math.BigDecimal;

import com.koushik.outspend.expense.entity.Category;

public record CategoryTotal(
        Category category,
        BigDecimal total,
        BigDecimal percentage) {
}
