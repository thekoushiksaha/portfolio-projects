package com.koushik.outspend.ratelimit;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.koushik.outspend.support.IntegrationTestBase;

@TestPropertySource(properties = {
        "app.rate-limit.auth-max-requests=3",
        "app.rate-limit.contact-max-requests=2",
        "app.rate-limit.window-seconds=60"
})
public class RateLimitIntegrationTest extends IntegrationTestBase {
    private RequestPostProcessor fromIp(String ip) {
        return request -> {
            request.setRemoteAddr(ip);
            return request;
        };
    }

    private ResultActions login(String ip) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .with(fromIp(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson("nobody@example.com", "Wrong@1234")));
    }

    private ResultActions contact(String ip) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/public/contact")
                .with(fromIp(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Sender","email":"sender@example.com","message":"Hello, this is a test message"}
                        """));
    }

    @Test
    void login_isBlockedAfterTheLimit_with429AndRetryAfter() throws Exception {
        for (int i = 0; i < 3; i++) {
            login("10.1.0.1").andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        login("10.1.0.1")
                .andExpect(MockMvcResultMatchers.status().isTooManyRequests())
                .andExpect(MockMvcResultMatchers.header().exists("Retry-After"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(false));
    }

    @Test
    void login_limitIsPerIp() throws Exception {
        for (int i = 0; i < 4; i++) {
            login("10.1.0.2");
        }

        login("10.1.0.3").andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void contactForm_isBlockedAfterTheLimit() throws Exception {
        contact("10.1.0.4").andExpect(MockMvcResultMatchers.status().isCreated());
        contact("10.1.0.4").andExpect(MockMvcResultMatchers.status().isCreated());

        contact("10.1.0.4").andExpect(MockMvcResultMatchers.status().isTooManyRequests());
    }

    @Test
    void otherEndpoints_areNotLimited() throws Exception {
        for (int i = 0; i < 6; i++) {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/public/about")
                    .with(fromIp("10.1.0.5")))
                    .andExpect(MockMvcResultMatchers.status().isOk());
        }
    }
}
