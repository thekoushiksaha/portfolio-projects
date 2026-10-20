package com.koushik.outspend.limit.model;

import java.math.BigDecimal;

import com.koushik.outspend.expense.entity.Category;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

public record LimitRequest(
                Category category,

                @NotNull(message = "Monthly limit is required") @DecimalMin(value = "0.01", message = "Limit must be at least 0.01") @Digits(integer = 10, fraction = 2, message = "Limit can have up to 10 digits and 2 decimals") BigDecimal monthlyLimit) {
}
