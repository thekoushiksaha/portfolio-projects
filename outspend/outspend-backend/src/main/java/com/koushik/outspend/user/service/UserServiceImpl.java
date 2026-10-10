package com.koushik.outspend.user.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.auth.repository.RefreshTokenRepository;
import com.koushik.outspend.common.exception.BadRequestException;
import com.koushik.outspend.common.exception.ResourceNotFoundException;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.mapper.UserMapper;
import com.koushik.outspend.user.model.ChangePasswordRequest;
import com.koushik.outspend.user.model.UpdateProfileRequest;
import com.koushik.outspend.user.model.UserResponse;
import com.koushik.outspend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public User getCurrentUserEnitity() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserResponse getCurrentUser() {
        return userMapper.toResponse(getCurrentUserEnitity());
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUserEnitity();
        user.setName(request.name().trim());
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUserEnitity();

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from the current one");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        refreshTokenRepository.deleteByUserId(user.getId());
    }
}
