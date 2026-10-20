package com.koushik.outspend.expense.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.koushik.outspend.expense.entity.Category;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExpenseRequest(
                @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", message = "Amount must be at least 0.01") @Digits(integer = 10, fraction = 2, message = "Amount can have up to 10 digits and 2 decimals") BigDecimal amount,

                @NotNull(message = "Category is required") Category category,

                @NotNull(message = "Date is required") LocalDate expenseDate,

                @Size(max = 255, message = "Note can be up to 255 characters") String note) {

}
