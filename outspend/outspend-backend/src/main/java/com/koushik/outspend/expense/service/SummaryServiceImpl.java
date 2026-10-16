package com.koushik.outspend.expense.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.expense.model.CategoryTotal;
import com.koushik.outspend.expense.model.MonthTotal;
import com.koushik.outspend.expense.model.SummaryResponse;
import com.koushik.outspend.expense.repository.ExpenseRepository;
import com.koushik.outspend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SummaryServiceImpl implements SummaryService {

    private static final int MAX_TREND_MONTHS = 12;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    private BigDecimal totalFor(Long userId, YearMonth month) {
        BigDecimal total = expenseRepository.totalBetween(userId, month.atDay(1), month.atEndOfMonth());
        return (total != null) ? total : BigDecimal.ZERO;
    }

    private BigDecimal percentage(BigDecimal part, BigDecimal total) {
        if (total.signum() == 0) {
            return BigDecimal.ZERO;
        }

        return part.multiply(BigDecimal.valueOf(100)).divide(total, 1, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional(readOnly = true)
    public SummaryResponse monthly(YearMonth month) {
        YearMonth target = (month != null) ? month : YearMonth.now();
        Long userId = userService.getCurrentUserEntity().getId();

        BigDecimal total = totalFor(userId, target);
        BigDecimal previous = totalFor(userId, target.minusMonths(1));

        List<CategoryTotal> byCategory = expenseRepository
                .totalsByCategory(userId, target.atDay(1), target.atEndOfMonth())
                .stream()
                .map(row -> {
                    Category category = (Category) row[0];
                    BigDecimal amount = (BigDecimal) row[1];
                    return new CategoryTotal(category, amount, percentage(amount, total));
                })
                .sorted(Comparator.comparing(CategoryTotal::total).reversed())
                .toList();

        return new SummaryResponse(target.toString(), total, previous, byCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthTotal> trend(int months) {
        int count = Math.min(Math.max(months, 1), MAX_TREND_MONTHS);
        Long userId = userService.getCurrentUserEntity().getId();
        YearMonth current = YearMonth.now();

        List<MonthTotal> result = new ArrayList<>();
        for (int i = count - 1; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            result.add(new MonthTotal(month.toString(), totalFor(userId, month)));
        }

        return result;
    }

}
