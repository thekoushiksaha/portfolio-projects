package com.koushik.outspend.expense.model;

import java.math.BigDecimal;
import java.util.List;

public record SummaryResponse(
        String month,
        BigDecimal totalSpent,
        BigDecimal previousMonthTotal,
        List<CategoryTotal> byCategory) {

}
