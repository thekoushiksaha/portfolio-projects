package com.koushik.outspend.expense.mapper;

import org.springframework.stereotype.Component;

import com.koushik.outspend.expense.entity.Expense;
import com.koushik.outspend.expense.model.ExpenseRequest;
import com.koushik.outspend.expense.model.ExpenseResponse;
import com.koushik.outspend.user.entity.User;

@Component
public class ExpenseMapper {
    private String cleanNote(String note) {
        if (note == null || note.isBlank()) {
            return null;
        }
        return note.trim();
    }

    public void updateEntity(Expense expense, ExpenseRequest request) {
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setExpenseDate(request.expenseDate());
        expense.setNote(cleanNote(request.note()));
    }

    public Expense toEntity(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        expense.setUser(user);
        updateEntity(expense, request);
        return expense;
    }

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getNote(),
                expense.getCreatedAt());
    }
}
