package com.koushik.outspend.limit;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;
import com.koushik.outspend.support.IntegrationTestBase;

public class LimitIntegrationTest extends IntegrationTestBase {
        private static final String AUTH = "Authorization";

        private static final String FOOD_LIMIT_100 = """
                        {"category":"FOOD","monthlyLimit":100}
                        """;

        private ResultActions putLimit(String bearer, String json) throws Exception {
                return mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/limits")
                                .header(AUTH, bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json));
        }

        private void addFoodExpense(String bearer, String amount) throws Exception {
                String json = """
                                {"amount":%s,"category":"FOOD","expenseDate":"%s"}
                                """.formatted(amount, LocalDate.now());

                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                                .header(AUTH, bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(MockMvcResultMatchers.status().isCreated());
        }

        @Test
        void status_followsSpending_fromOkToWarningToExceeded() throws Exception {
                String bearer = newUserBearer();

                putLimit(bearer, FOOD_LIMIT_100)
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.status").value("OK"));

                addFoodExpense(bearer, "85");
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/limits").header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].status").value("WARNING"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].percentUsed").value(85.0));

                addFoodExpense(bearer, "20");
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/limits").header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data[0].status").value("EXCEEDED"));
        }

        @Test
        void settingTheSameLimitTwice_updatesInsteadOfDuplicating() throws Exception {
                String bearer = newUserBearer();

                putLimit(bearer, FOOD_LIMIT_100).andExpect(MockMvcResultMatchers.status().isOk());
                putLimit(bearer, """
                                {"category":"FOOD","monthlyLimit":250}
                                """).andExpect(MockMvcResultMatchers.status().isOk());

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/limits").header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.length()").value(1));
        }

        @Test
        void invalidLimit_returns400() throws Exception {
                putLimit(newUserBearer(), """
                                {"category":"F00D","monthlyLimit":-5}
                                """).andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        void anotherUsersLimit_cannotBeDeleted() throws Exception {
                String owner = newUserBearer();
                String intruder = newUserBearer();

                String body = putLimit(owner, FOOD_LIMIT_100)
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andReturn().getResponse().getContentAsString();

                Number id = JsonPath.read(body, "$.data.id");

                mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/limits/" + id.longValue()).header(AUTH,
                                intruder))
                                .andExpect(MockMvcResultMatchers.status().isNotFound());
                mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/limits/" + id.longValue()).header(AUTH, owner))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }
}
