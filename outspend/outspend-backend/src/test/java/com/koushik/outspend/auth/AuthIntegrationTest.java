package com.koushik.outspend.auth;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;
import com.koushik.outspend.support.IntegrationTestBase;

public class AuthIntegrationTest extends IntegrationTestBase {

        @Test
        void register_returnsTokenAndUser_withoutExposingThePassword() throws Exception {
                String email = uniqueEmail();

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(registerJson(email)))
                                .andExpect(MockMvcResultMatchers.status().isCreated())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.accessToken").isNotEmpty())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.refreshToken").isNotEmpty())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.user.email").value(email))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.user.role").value("ROLE_USER"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.user.password").doesNotExist());
        }

        @Test
        void register_withDuplicateEmail_returns409() throws Exception {
                String email = uniqueEmail();
                register(email);

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(registerJson(email)))
                                .andExpect(MockMvcResultMatchers.status().isConflict())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(false));
        }

        @Test
        void register_withInvalidBody_returns400WithFieldErrors() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                                {"name":"","email":"bad","password":"1"}
                                                """))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").exists())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.email").exists())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.password").exists());
        }

        @Test
        void login_withCorrectPassword_returnsTokens() throws Exception {
                String email = uniqueEmail();
                register(email);

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson(email, PASSWORD)))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.accessToken").isNotEmpty());
        }

        @Test
        void login_withWrongPassword_returns401() throws Exception {
                String email = uniqueEmail();
                register(email);

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson(email, "WrongPassword@123")))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.message")
                                                .value("Invalid email or password"));
        }

        @Test
        void protectedEndpoint_withoutToken_returns401() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users/me"))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        @Test
        void protectedEndpoints_withGarbageToken_returns401() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users/me").header("Authorization",
                                "Bearer not-a-token"))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        @Test
        void me_withValidToken_returnsTheProfile() throws Exception {
                String email = uniqueEmail();
                String token = JsonPath.read(register(email), "$.data.accessToken");

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/users/me").header("Authorization",
                                "Bearer " + token))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.email").value(email));
        }

        @Test
        void refresh_rotatesTheToken_andRefreshingAnOldOneKillsAllSessions() throws Exception {
                String firstRefresh = JsonPath.read(register(uniqueEmail()), "$.data.refreshToken");

                String refreshed = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(refreshJson(firstRefresh)))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andReturn().getResponse().getContentAsString();

                String secondRefresh = JsonPath.read(refreshed, "$.data.refreshToken");

                Assertions.assertThat(secondRefresh).isNotEqualTo(firstRefresh);

                // The old token was already used: rejected, and every session of this user is
                // ended.
                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(refreshJson(firstRefresh)))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        @Test
        void logout_revokesTheRefreshToken() throws Exception {
                String refreshToken = JsonPath.read(register(uniqueEmail()), "$.data.refreshToken");

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/logout")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(refreshJson(refreshToken)))
                                .andExpect(MockMvcResultMatchers.status().isOk());

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(refreshJson(refreshToken)))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

}
