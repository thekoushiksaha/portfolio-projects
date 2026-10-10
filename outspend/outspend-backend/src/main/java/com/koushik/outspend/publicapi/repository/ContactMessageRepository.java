package com.koushik.outspend.publicapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koushik.outspend.publicapi.entity.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

}
