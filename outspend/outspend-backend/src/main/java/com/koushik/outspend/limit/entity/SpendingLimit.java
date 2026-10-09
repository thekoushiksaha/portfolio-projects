package com.koushik.outspend.limit.entity;

import java.math.BigDecimal;

import com.koushik.outspend.expense.entity.Category;
import com.koushik.outspend.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "spending_limits", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "category" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpendingLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyLimit;
}
