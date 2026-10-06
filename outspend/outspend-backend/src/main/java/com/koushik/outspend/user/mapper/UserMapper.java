package com.koushik.outspend.user.mapper;

import org.springframework.stereotype.Component;

import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.model.UserResponse;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getCreatedAt());
    }
}
