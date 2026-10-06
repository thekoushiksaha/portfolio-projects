package com.koushik.outspend.user.service;

import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.model.UserResponse;

public interface UserService {
    public User getCurrentUserEnitity();

    public UserResponse getCurrentUser();
}
