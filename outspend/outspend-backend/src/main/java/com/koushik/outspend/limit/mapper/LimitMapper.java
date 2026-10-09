package com.koushik.outspend.limit.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.koushik.outspend.limit.entity.SpendingLimit;
import com.koushik.outspend.limit.model.LimitResponse;
import com.koushik.outspend.limit.model.LimitStatus;

@Component
public class LimitMapper {
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal WARNING_PERCENT = BigDecimal.valueOf(80);

    private LimitStatus statusOf(BigDecimal spent, BigDecimal max) {
        if (spent.compareTo(max) > 0) {
            return LimitStatus.EXCEEDED;
        }

        if (spent.multiply(HUNDRED).compareTo(max.multiply(WARNING_PERCENT)) >= 0) {
            return LimitStatus.WARNING;
        }

        return LimitStatus.OK;
    }

    public LimitResponse toResponse(SpendingLimit limit, BigDecimal spent) {
        BigDecimal max = limit.getMonthlyLimit();

        BigDecimal percentUsed = spent.multiply(HUNDRED).divide(max, 1, RoundingMode.HALF_UP);
        BigDecimal remaining = max.subtract(spent).max(BigDecimal.ZERO);

        return new LimitResponse(
                limit.getId(),
                limit.getCategory(),
                max,
                spent,
                remaining,
                percentUsed,
                statusOf(spent, max));
    }
}
