package com.koushik.outspend.user.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
                @NotBlank(message = "Current password is required") String currentPassword,

                @NotBlank(message = "New password is required") @Size(min = 8, max = 64, message = "Password must be 8 to 64 characters") String newPassword) {

}
