package com.koushik.outspend.publicapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.publicapi.entity.ContactMessage;
import com.koushik.outspend.publicapi.model.AboutResponse;
import com.koushik.outspend.publicapi.model.ContactRequest;
import com.koushik.outspend.publicapi.repository.ContactMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {
    private final ContactMessageRepository contactMessageRepository;

    @Value("${app.name:OutSpend}")
    private String appName;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Override
    public AboutResponse getAbout() {
        return new AboutResponse(
                appName,
                appVersion,
                "OutSpend helps you see where money goes. It tracks expenses only, so there is nothing else to manage.");
    }

    @Override
    @Transactional
    public void submitContact(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim().toLowerCase());
        message.setMessage(request.message().trim());

        contactMessageRepository.save(message);
    }

}
