package com.koushik.outspend.ratelimit;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.LongSupplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class InMemoryRateLimiter {
    private static final int CLEANUP_THRESHOLD = 10_000;

    public record Result(boolean allowed, long retryAfterSeconds) {
    }

    private record Window(long startMillis, int count) {
    }

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();
    private final LongSupplier clock;

    @Autowired
    public InMemoryRateLimiter() {
        this(System::currentTimeMillis);
    }

    InMemoryRateLimiter(LongSupplier clock) {
        this.clock = clock;
    }

    public Result tryAcquire(String key, int maxRequests, Duration window) {
        long now = clock.getAsLong();
        long windowMillis = window.toMillis();

        if (windows.size() > CLEANUP_THRESHOLD) {
            windows.entrySet().removeIf(e -> now - e.getValue().startMillis() >= windowMillis);
        }

        Window current = windows.compute(key, (k, existing) -> existing == null
                || now - existing.startMillis() >= windowMillis
                        ? new Window(now, 1)
                        : new Window(existing.startMillis(), existing.count() + 1));

        if (current.count() <= maxRequests) {
            return new Result(true, 0);
        }

        long retryAfterMillis = current.startMillis() + windowMillis - now;
        return new Result(false, Math.max(1, (retryAfterMillis + 999) / 1000));
    }
}
