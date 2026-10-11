package com.koushik.outspend.publicapi;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.koushik.outspend.support.IntegrationTestBase;

public class PublicApiIntegrationTest extends IntegrationTestBase {
    @Test
    void about_isPublic() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/public/about"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").value("OutSpend"));
    }

    @Test
    void contact_withValidMessage_returns201_withoutLogin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/public/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Koushik Saha", "email":"thekoushiksaha@zohomail.in", "message":"Loving the app"}
                        """))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    void contact_withInvalidBody_returns400() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/public/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"","email":"bad","message":"hi"}
                                """))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(false))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").value("Name is required"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.email").value("Enter a valid email"));
    }

    @Test
    void apiDocs_arePublishedAndPublic() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v3/api-docs"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.info.title").value("OutSpend API"));
    }
}
