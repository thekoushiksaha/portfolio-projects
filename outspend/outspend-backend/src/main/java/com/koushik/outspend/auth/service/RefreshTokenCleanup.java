package com.koushik.outspend.auth.service;

import java.time.Instant;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.koushik.outspend.auth.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefreshTokenCleanup {
    private final RefreshTokenRepository refreshTokenRepository;

    // Only expired rows are deleted. Revoked-but-unexpired ones stay so reuse
    // detection works.
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void purgeExpired() {
        log.info("Purged {} expired refresh tokens", refreshTokenRepository.deleteExpired(Instant.now()));
    }
}
