package com.koushik.outspend.expense.service;

import java.time.LocalDate;

import com.koushik.outspend.common.response.PageResponse;
import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.expense.model.ExpenseRequest;
import com.koushik.outspend.expense.model.ExpenseResponse;

public interface ExpenseService {
    ExpenseResponse create(ExpenseRequest request);

    PageResponse<ExpenseResponse> list(Category category, LocalDate from, LocalDate to, int page, int size);

    ExpenseResponse get(Long id);

    ExpenseResponse update(Long id, ExpenseRequest request);

    void delete(Long id);
}
