package com.koushik.outspend.user;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;
import com.koushik.outspend.support.IntegrationTestBase;

public class UserIntegrationTest extends IntegrationTestBase {
    private static final String NEW_PASSWORD = "Another@5678";

    private String passwordJson(String current, String next) {
        return """
                {"currentPassword":"%s", "newPassword":"%s"}
                """.formatted(current, next);
    }

    @Test
    void updateProfile_changesTheName() throws Exception {
        String bearer = newUserBearer();

        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/users/me")
                .header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                            {"name":" New Name "}
                        """))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").value("New Name"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users/me")
                .header("Authorization", bearer))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").value("New Name"));
    }

    @Test
    void updateProfile_withBlankName_returns400() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/users/me")
                .header("Authorization", newUserBearer())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":""}
                        """))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").exists());
    }

    @Test
    void changePassword_withWrongCurrentPassword_returns400() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/users/me/password")
                .header("Authorization", newUserBearer())
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson("wrong-password", NEW_PASSWORD)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void changePassword_withSamePassword_returns400() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/users/me/password")
                .header("Authorization", newUserBearer())
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson(PASSWORD, PASSWORD)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void changePassword_revokeRefreshTokens_andSwitchesTheLogin() throws Exception {
        String email = uniqueEmail();
        String registered = register(email);
        String bearer = "Bearer " + JsonPath.read(registered, "$.data.accessToken");
        String refreshToken = JsonPath.read(registered, "$.data.refreshToken");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/users/me/password")
                .header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON)
                .content(passwordJson(PASSWORD, NEW_PASSWORD)))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // the old refresh token is gone
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refreshJson(refreshToken)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());

        // old password no longer works, new one does
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(email, PASSWORD)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(email, NEW_PASSWORD)))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
