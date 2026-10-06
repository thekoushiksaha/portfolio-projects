package com.koushik.outspend.user.model;

import java.time.Instant;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role,
        Instant createdAt) {
}
