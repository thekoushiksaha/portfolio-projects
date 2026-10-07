package com.koushik.outspend.auth.model;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "Refresh token is required") String refreshToken) {

}
