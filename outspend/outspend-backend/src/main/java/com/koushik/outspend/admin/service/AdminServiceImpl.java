package com.koushik.outspend.admin.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.admin.model.ContactMessageResponse;
import com.koushik.outspend.common.response.PageResponse;
import com.koushik.outspend.publicapi.repository.ContactMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

        private static final int MAX_PAGE_SIZE = 50;
        private final ContactMessageRepository contactMessageRepository;

        @Override
        @Transactional(readOnly = true)
        public PageResponse<ContactMessageResponse> listContactMessages(int page, int size) {
                PageRequest pageRequest = PageRequest.of(
                                Math.max(page, 0),
                                Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                                Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")));

                return PageResponse.from(contactMessageRepository.findAll(pageRequest)
                                .map(m -> new ContactMessageResponse(m.getId(), m.getName(), m.getEmail(),
                                                m.getMessage(),
                                                m.getCreatedAt())));
        }

}
