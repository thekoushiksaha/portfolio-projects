package com.koushik.outspend.user.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
                @NotBlank(message = "Name is required") @Size(max = 100, message = "Name can be up to 100 characters") String name) {

}
