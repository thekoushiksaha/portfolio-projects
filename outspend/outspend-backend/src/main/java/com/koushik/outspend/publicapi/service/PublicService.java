package com.koushik.outspend.publicapi.service;

import com.koushik.outspend.publicapi.model.AboutResponse;
import com.koushik.outspend.publicapi.model.ContactRequest;

public interface PublicService {
    AboutResponse getAbout();

    void submitContact(ContactRequest request);
}
