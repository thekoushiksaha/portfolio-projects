package com.koushik.outspend.user.service;

import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.model.ChangePasswordRequest;
import com.koushik.outspend.user.model.UpdateProfileRequest;
import com.koushik.outspend.user.model.UserResponse;

public interface UserService {
    public User getCurrentUserEntity();

    public UserResponse getCurrentUser();

    UserResponse updateProfile(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);
}
