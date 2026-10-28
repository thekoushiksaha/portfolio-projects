package com.koushik.outspend.ratelimit;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    private final InMemoryRateLimiter rateLimiter;

    @Value("${app.rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${app.rate-limit.auth-max-requests:10}")
    private int authMaxRequests;

    @Value("${app.rate-limit.contact-max-requests:5}")
    private int contactMaxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private long windowSeconds;

    private record Rule(String name, int maxRequests) {
    }

    private Rule ruleFor(HttpServletRequest request) {
        if (!HttpMethod.POST.matches(request.getMethod())) {
            return null;
        }

        return switch (request.getRequestURI()) {
            case "/api/v1/auth/login", "/api/v1/auth/register" -> new Rule("auth", authMaxRequests);
            case "/api/v1/public/contact" -> new Rule("contact", contactMaxRequests);
            default -> null;
        };
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Rule rule = enabled ? ruleFor(request) : null;

        if (rule == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = rule.name() + ":" + request.getRemoteAddr();
        InMemoryRateLimiter.Result result = rateLimiter.tryAcquire(key, rule.maxRequests(),
                Duration.ofSeconds(windowSeconds));

        if (result.allowed()) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(result.retryAfterSeconds()));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Try again in "
                + result.retryAfterSeconds() + " seconds.\",\"data\":null, \"timestamp\":\"" + Instant.now() + "\"}");
    }
}
