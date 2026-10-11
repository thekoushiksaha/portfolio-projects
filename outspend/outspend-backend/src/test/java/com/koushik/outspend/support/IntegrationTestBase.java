package com.koushik.outspend.support;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class IntegrationTestBase {
    protected static final String PASSWORD = "Test@1234";

    @Autowired
    protected MockMvc mockMvc;

    protected String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@gmail.com";
    }

    protected String registerJson(String email) {
        return """
                {"name":"Test User","email":"%s","password":"%s"}
                """.formatted(email, PASSWORD);
    }

    protected String loginJson(String email, String password) {
        return """
                {"email":"%s","password":"%s"}
                """.formatted(email, password);
    }

    protected String refreshJson(String refreshToken) {
        return """
                {"refreshToken":"%s"}
                """.formatted(refreshToken);
    }

    /** Registers a user and returns the full JSON response body. */
    protected String register(String email) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn().getResponse().getContentAsString();
    }

    /**
     * Registers a brand-new user and returns a ready-to-use Authorization header
     * value.
     */
    protected String newUserBearer() throws Exception {
        String token = JsonPath.read(register(uniqueEmail()), "$.data.accessToken");

        return "Bearer " + token;
    }

}
