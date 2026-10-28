package com.koushik.outspend.ratelimit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.Test;

public class InMemoryRateLimiterTest {
    private static final Duration WINDOW = Duration.ofSeconds(60);

    private final AtomicLong now = new AtomicLong(1_000_000);
    private final InMemoryRateLimiter limiter = new InMemoryRateLimiter(now::get);

    @Test
    void allowUpToTheLimit_thenBlocks() {
        for (int i = 0; i < 3; i++) {
            assertTrue(limiter.tryAcquire("ip", 3, WINDOW).allowed());
        }

        assertFalse(limiter.tryAcquire("ip", 3, WINDOW).allowed());
    }

    @Test
    void blockedkResult_saysHowLongToWait() {
        for (int i = 0; i < 3; i++) {
            limiter.tryAcquire("ip", 3, WINDOW);
        }

        now.addAndGet(20_000);

        InMemoryRateLimiter.Result result = limiter.tryAcquire("ip", 3, WINDOW);

        assertFalse(result.allowed());
        assertEquals(40, result.retryAfterSeconds());
    }

    @Test
    void allowsAgainOnceTheWindowHasPassed() {
        for (int i = 0; i < 4; i++) {
            limiter.tryAcquire("ip", 3, WINDOW);
        }
        now.addAndGet(60_000);
        assertTrue(limiter.tryAcquire("ip-b", 3, WINDOW).allowed());
    }

    @Test
    void keysAreCountedSeperately() {
        for (int i = 0; i < 4; i++) {
            limiter.tryAcquire("ip-a", 3, WINDOW);
        }
        assertTrue(limiter.tryAcquire("ip-b", 3, WINDOW).allowed());
    }
}
