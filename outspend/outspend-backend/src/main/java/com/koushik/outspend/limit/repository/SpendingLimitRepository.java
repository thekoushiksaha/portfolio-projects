package com.koushik.outspend.limit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.limit.entity.SpendingLimit;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    List<SpendingLimit> findByUserId(Long userId);

    Optional<SpendingLimit> findByIdAndUserId(Long id, Long userId);

    Optional<SpendingLimit> findByUserIdAndCategory(Long userId, Category category);

    Optional<SpendingLimit> findByUserIdAndCategoryIsNull(Long userId);
}
