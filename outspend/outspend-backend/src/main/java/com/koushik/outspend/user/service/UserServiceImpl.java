package com.koushik.outspend.user.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.koushik.outspend.common.exception.ResourceNotFoundException;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.mapper.UserMapper;
import com.koushik.outspend.user.model.UserResponse;
import com.koushik.outspend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

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

}
