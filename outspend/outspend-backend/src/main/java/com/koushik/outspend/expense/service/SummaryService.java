package com.koushik.outspend.expense.service;

import java.time.YearMonth;
import java.util.List;

import com.koushik.outspend.expense.model.MonthTotal;
import com.koushik.outspend.expense.model.SummaryResponse;

public interface SummaryService {
    SummaryResponse monthly(YearMonth month);

    List<MonthTotal> trend(int months);

}
