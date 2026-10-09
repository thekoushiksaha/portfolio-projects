package com.koushik.outspend.limit.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.common.exception.ResourceNotFoundException;
import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.expense.repository.ExpenseRepository;
import com.koushik.outspend.limit.entity.SpendingLimit;
import com.koushik.outspend.limit.mapper.LimitMapper;
import com.koushik.outspend.limit.model.LimitRequest;
import com.koushik.outspend.limit.model.LimitResponse;
import com.koushik.outspend.limit.repository.SpendingLimitRepository;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LimitServiceImpl implements LimitService {

    private final SpendingLimitRepository limitRepository;
    private final ExpenseRepository expenseRepository;
    private final LimitMapper limitMapper;
    private final UserService userService;

    private Optional<SpendingLimit> findExisting(Long userId, Category category) {
        return (category == null)
                ? limitRepository.findByUserIdAndCategoryIsNull(userId)
                : limitRepository.findByUserIdAndCategory(userId, category);
    }

    private record Usage(BigDecimal total, Map<Category, BigDecimal> byCategory) {
        BigDecimal spendFor(Category category) {
            return (category == null)
                    ? total
                    : byCategory.getOrDefault(category, BigDecimal.ZERO);
        }
    }

    private Usage usageFor(Long userId, YearMonth month) {
        BigDecimal total = expenseRepository.totalBetween(userId, month.atDay(1), month.atEndOfMonth());

        Map<Category, BigDecimal> byCategory = new EnumMap<>(Category.class);
        for (Object[] row : expenseRepository.totalsByCategory(userId, month.atDay(1), month.atEndOfMonth())) {
            byCategory.put((Category) row[0], (BigDecimal) row[1]);
        }

        return new Usage(total != null ? total : BigDecimal.ZERO, byCategory);
    }

    @Override
    @Transactional
    public LimitResponse save(LimitRequest request) {
        User user = userService.getCurrentUserEnitity();

        SpendingLimit limit = findExisting(user.getId(), request.category())
                .orElseGet(() -> {
                    SpendingLimit created = new SpendingLimit();
                    created.setUser(user);
                    created.setCategory(request.category());
                    return created;
                });

        limit.setMonthlyLimit(request.monthlyLimit());
        SpendingLimit saved = limitRepository.save(limit);

        Usage usage = usageFor(user.getId(), YearMonth.now());
        return limitMapper.toResponse(saved, usage.spendFor(saved.getCategory()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LimitResponse> list(YearMonth month) {
        YearMonth target = (month != null) ? month : YearMonth.now();
        Long userId = userService.getCurrentUserEnitity().getId();
        Usage usage = usageFor(userId, target);

        return limitRepository.findByUserId(userId)
                .stream()
                .sorted(Comparator.comparing(SpendingLimit::getCategory,
                        Comparator.nullsFirst(Comparator.naturalOrder())))
                .map(limit -> limitMapper.toResponse(limit, usage.spendFor(limit.getCategory())))
                .toList();
    }

    @Override
    public void delete(Long id) {
        Long userId = userService.getCurrentUserEnitity().getId();

        SpendingLimit limit = limitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Limit not found"));

        limitRepository.delete(limit);
    }

}
