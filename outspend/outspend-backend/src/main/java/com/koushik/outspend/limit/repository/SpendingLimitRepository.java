package com.koushik.outspend.limit.repository;

import java.util.List;
import java.util.Optional;
import java.util.Locale.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koushik.outspend.limit.entity.SpendingLimit;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    List<SpendingLimit> findByUserId(Long userId);

    Optional<SpendingLimit> findByUserIdAndCategory(Long userId, Category category);
}
