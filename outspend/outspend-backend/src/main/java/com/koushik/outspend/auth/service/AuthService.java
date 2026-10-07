package com.koushik.outspend.auth.service;

import com.koushik.outspend.auth.model.AuthResponse;
import com.koushik.outspend.auth.model.LoginRequest;
import com.koushik.outspend.auth.model.RefreshRequest;
import com.koushik.outspend.auth.model.RegistrationRequest;

public interface AuthService {
    AuthResponse register(RegistrationRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshRequest request);

    void logout(RefreshRequest request);

}
