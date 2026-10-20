package com.koushik.outspend.admin;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;
import com.koushik.outspend.support.IntegrationTestBase;

public class AdminIntegrationTest extends IntegrationTestBase {
        private static final String ADMIN_EMAIL = "admin-test@outspend.com";
        private static final String ADMIN_PASSWORD = "Admin-Test@12345";

        private String adminBearer() throws Exception {
                String body = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson(ADMIN_EMAIL, ADMIN_PASSWORD)))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andReturn().getResponse().getContentAsString();

                return "Bearer " + JsonPath.read(body, "$.data.accessToken");
        }

        @Test
        void contactMessage_withoutToken_returns401() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/admin/contact-messages"))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        @Test
        void contactMessages_asNormalUser_returns403() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/admin/contact-messages")
                                .header("Authorization", newUserBearer()))
                                .andExpect(MockMvcResultMatchers.status().isForbidden());
        }

        @Test
        void contactMessages_asAdmin_returnsSubmittedMessagesNewestFirst() throws Exception {
                String marker = "admin-test-" + UUID.randomUUID();

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/public/contact")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                                {"name":"Sender", "email":"sender@example.com","message":"%s"}
                                                """.formatted(marker)))
                                .andExpect(MockMvcResultMatchers.status().isCreated());

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/admin/contact-messages")
                                .param("size", "5")
                                .header("Authorization", adminBearer()))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].message").value(marker))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].email")
                                                .value("sender@example.com"));
        }
}
