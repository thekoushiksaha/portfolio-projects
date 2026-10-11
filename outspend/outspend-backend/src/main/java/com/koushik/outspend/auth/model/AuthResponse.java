package com.koushik.outspend.auth.model;

import com.koushik.outspend.user.model.UserResponse;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
        UserResponse user) {

}
