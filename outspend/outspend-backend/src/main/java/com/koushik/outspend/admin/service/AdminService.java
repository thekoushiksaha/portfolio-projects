package com.koushik.outspend.admin.service;

import com.koushik.outspend.admin.model.ContactMessageResponse;
import com.koushik.outspend.common.response.PageResponse;

public interface AdminService {
    PageResponse<ContactMessageResponse> listContactMessages(int page, int size);
}
