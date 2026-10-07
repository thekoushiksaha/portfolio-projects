package com.koushik.outspend.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.auth.entity.RefreshToken;
import com.koushik.outspend.auth.model.AuthResponse;
import com.koushik.outspend.auth.model.LoginRequest;
import com.koushik.outspend.auth.model.RefreshRequest;
import com.koushik.outspend.auth.model.RegistrationRequest;
import com.koushik.outspend.auth.repository.RefreshTokenRepository;
import com.koushik.outspend.common.exception.ConflictException;
import com.koushik.outspend.common.exception.ResourceNotFoundException;
import com.koushik.outspend.common.exception.UnauthorizedException;
import com.koushik.outspend.config.AppConstants;
import com.koushik.outspend.security.JwtUtil;
import com.koushik.outspend.user.entity.Role;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.mapper.UserMapper;
import com.koushik.outspend.user.repository.RoleRepository;
import com.koushik.outspend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Value("${app.jwt.refresh-expiry-days}")
    private long refreshExpiryDays;

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().getName());

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plus(refreshExpiryDays, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshToken.getToken(), "Bearer", jwtUtil.getAccessExpirtySeconds(),
                userMapper.toResponse(user));
    }

    @Override
    @Transactional
    public AuthResponse register(RegistrationRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("That email is already registered");
        }

        Role role = roleRepository.findByName(AppConstants.ROLE_USER)
                .orElseThrow(() -> new IllegalStateException("ROLE_USER missing, check RoleSeeder"));
        User user = userRepository.save(User.builder()
                .name(request.email().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .build());

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    @Override
    @Transactional(noRollbackFor = UnauthorizedException.class)
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken old = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (old.isRevoked()) {
            refreshTokenRepository.deleteByUserId(old.getUser().getId());
            throw new UnauthorizedException("Refresh token was already used. Log in again");
        }

        if (old.getExpiryDate().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token expired. Log in again");
        }

        old.setRevoked(true);

        return buildAuthResponse(old.getUser());
    }

    @Override
    @Transactional
    public void logout(RefreshRequest request) {
        refreshTokenRepository.findByToken(request.refreshToken())
                .ifPresent(token -> token.setRevoked(true));
    }

}
