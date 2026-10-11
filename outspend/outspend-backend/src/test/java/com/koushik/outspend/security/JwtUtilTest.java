package com.koushik.outspend.security;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.security.WeakKeyException;

public class JwtUtilTest {
    private static final String SECRET = "test-secret-test-secret-test-secret-test-secret-test-secret-123456";
    private static final String OTHER_SECRET = "another-secret-another-secret-another-secret-123456";

    private final JwtUtil jwtUtil = new JwtUtil(SECRET, 15);

    private UserDetails userDetails(String email) {
        return User.withUsername(email).password("x").authorities("ROLE_USER").build();
    }

    @Test
    void validToken_isAcceptedForTheSameUser() {
        String token = jwtUtil.generateAccessToken("a@gmail.com", "ROLE_USER");

        Assertions.assertThat(jwtUtil.extractEmail(token)).isEqualTo("a@gmail.com");
        Assertions.assertThat(jwtUtil.isValid(token, userDetails("a@gmail.com"))).isTrue();
    }

    @Test
    void tokenSignedWithAnotherSecret_isRejected() {
        String forged = new JwtUtil(OTHER_SECRET, 15).generateAccessToken("a@gmail.com", "ROLE_USER");

        Assertions.assertThat(jwtUtil.isValid(forged, userDetails("a@gmail.com"))).isFalse();
    }

    @Test
    void expiredToken_isRejected() {
        String expired = new JwtUtil(SECRET, -1).generateAccessToken("a@gmail.com", "ROLE_USER");

        Assertions.assertThat(jwtUtil.isValid(expired, userDetails("a@gmail.com"))).isFalse();
    }

    @Test
    void garbageToken_isRejected() {
        Assertions.assertThat(jwtUtil.isValid("not-a-token", userDetails("a@gmail.com"))).isFalse();
    }

    @Test
    void tooShortSecret_failsFast() {
        Assertions.assertThatThrownBy(() -> new JwtUtil("short", 15)).isInstanceOf(WeakKeyException.class);
    }

    @Test
    void expirySeconds_matchesConfiguredMinutes() {
        Assertions.assertThat(jwtUtil.getAccessExpirtySeconds()).isEqualTo(900);
    }
}
