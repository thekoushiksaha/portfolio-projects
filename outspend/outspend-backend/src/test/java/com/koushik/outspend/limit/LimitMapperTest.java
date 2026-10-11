package com.koushik.outspend.limit;

import java.math.BigDecimal;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.limit.entity.SpendingLimit;
import com.koushik.outspend.limit.mapper.LimitMapper;
import com.koushik.outspend.limit.model.LimitResponse;
import com.koushik.outspend.limit.model.LimitStatus;

public class LimitMapperTest {
    private final LimitMapper mapper = new LimitMapper();

    private SpendingLimit limitOf(String max) {
        SpendingLimit limit = new SpendingLimit();
        limit.setCategory(Category.FOOD);
        limit.setMonthlyLimit(new BigDecimal(max));
        return limit;
    }

    @Test
    void belowEightyPercent_isOk() {
        LimitResponse response = mapper.toResponse(limitOf("500"), new BigDecimal("399.99"));
        Assertions.assertThat(response.status()).isEqualTo(LimitStatus.OK);
    }

    @Test
    void exactlyEightyPercent_isWarning() {
        LimitResponse response = mapper.toResponse(limitOf("500"), new BigDecimal("400"));
        Assertions.assertThat(response.status()).isEqualTo(LimitStatus.WARNING);
    }

    @Test
    void exactlyAtTheLimit_isWarningNotExceeded() {
        LimitResponse response = mapper.toResponse(limitOf("500"), new BigDecimal("500"));

        Assertions.assertThat(response.status()).isEqualTo(LimitStatus.WARNING);
        Assertions.assertThat(response.remaining()).isEqualByComparingTo("0");
    }

    @Test
    void overTheLimi_isExceeded_andRemainingNeverGoesNegative() {
        LimitResponse response = mapper.toResponse(limitOf("500"), new BigDecimal("510"));

        Assertions.assertThat(response.status()).isEqualTo(LimitStatus.EXCEEDED);
        Assertions.assertThat(response.remaining()).isEqualByComparingTo("0");
    }

    @Test
    void percentUsed_isRoundedToOneDecimal() {
        LimitResponse response = mapper.toResponse(limitOf("450"), new BigDecimal("400"));

        Assertions.assertThat(response.percentUsed()).isEqualByComparingTo("88.9");
    }
}
