package com.koushik.outspend.expense.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.common.exception.BadRequestException;
import com.koushik.outspend.common.exception.ResourceNotFoundException;
import com.koushik.outspend.common.response.PageResponse;
import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.expense.entity.Expense;
import com.koushik.outspend.expense.mapper.ExpenseMapper;
import com.koushik.outspend.expense.model.ExpenseRequest;
import com.koushik.outspend.expense.model.ExpenseResponse;
import com.koushik.outspend.expense.repository.ExpenseRepository;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.service.UserService;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private static final int MAX_PAGE_SIZE = 50;

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final UserService userService;

    private Expense findOwned(Long id, Long userId) {
        return expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    @Override
    @Transactional
    public ExpenseResponse create(ExpenseRequest request) {
        User user = userService.getCurrentUserEntity();
        Expense saved = expenseRepository.save(expenseMapper.toEntity(request, user));
        return expenseMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ExpenseResponse> list(Category category, LocalDate from, LocalDate to, int page, int size) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new BadRequestException("'from' date must be on or before 'to' date");
        }

        Long userId = userService.getCurrentUserEntity().getId();

        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), from));
            }

            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), to));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        PageRequest pageRequest = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by(
                        Sort.Order.desc("expenseDate"),
                        Sort.Order.desc("id")));

        Page<ExpenseResponse> result = expenseRepository.findAll(spec, pageRequest)
                .map(expenseMapper::toResponse);

        return PageResponse.from(result);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse get(Long id) {
        Long userId = userService.getCurrentUserEntity().getId();
        return expenseMapper.toResponse(findOwned(id, userId));
    }

    @Override
    @Transactional
    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Long userId = userService.getCurrentUserEntity().getId();
        Expense expense = findOwned(id, userId);
        expenseMapper.updateEntity(expense, request);
        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = userService.getCurrentUserEntity().getId();
        expenseRepository.delete(findOwned(id, userId));
    }

}
