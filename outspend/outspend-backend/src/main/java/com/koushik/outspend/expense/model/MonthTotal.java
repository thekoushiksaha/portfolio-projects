package com.koushik.outspend.expense.model;

import java.math.BigDecimal;

public record MonthTotal(
        String month,
        BigDecimal total) {

}
