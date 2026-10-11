package com.koushik.outspend.expense;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.jayway.jsonpath.JsonPath;
import com.koushik.outspend.support.IntegrationTestBase;

public class ExpenseIntegrationTest extends IntegrationTestBase {
        private static final String AUTH = "Authorization";

        private String expenseJson(String amount, String category, String date) {
                return """
                                {"amount":%s,"category":"%s","expenseDate":"%s","note":"test"}
                                """.formatted(amount, category, date);
        }

        private long createExpense(String bearer, String json) throws Exception {
                String body = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                                .header(AUTH, bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(MockMvcResultMatchers.status().isCreated())
                                .andReturn().getResponse().getContentAsString();

                Number id = JsonPath.read(body, "$.data.id");
                return id.longValue();
        }

        @Test
        void create_returns201WithTheSavedExpense() throws Exception {
                String bearer = newUserBearer();
                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                                .header(AUTH, bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(expenseJson("54.50", "FOOD", "2026-10-10")))
                                .andExpect(MockMvcResultMatchers.status().isCreated())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.id").isNumber())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.category").value("FOOD"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.expenseDate").value("2026-10-10"));
        }

        @Test
        void create_withNegativeAmount_returns400() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                                .header(AUTH, newUserBearer())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(expenseJson("-5", "FOOD", "2026-10-10")))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.amount").exists());
        }

        @Test
        void create_withUnknownCategory_returns400() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                                .header(AUTH, newUserBearer())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(expenseJson("10", "ABC", "2026-10-10")))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        void withoutToken_returns401() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses"))
                                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
        }

        @Test
        void list_returnsOnlyTheCallersOwnExpenses() throws Exception {
                String userA = newUserBearer();
                String userB = newUserBearer();

                createExpense(userA, expenseJson("10", "FOOD", "2026-10-10"));
                createExpense(userA, expenseJson("20", "BILLS", "2026-10-10"));
                createExpense(userB, expenseJson("30", "OTHER", "2026-10-09"));

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses").header(AUTH, userA))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalElements").value(2));

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses").header(AUTH, userB))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalElements").value(1));

        }

        @Test
        void list_filtersByCategory() throws Exception {
                String bearer = newUserBearer();
                createExpense(bearer, expenseJson("10", "FOOD", "2026-10-10"));
                createExpense(bearer, expenseJson("20", "TRANSPORT", "2026-10-10"));

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses").param("category", "FOOD").header(AUTH,
                                bearer))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalElements").value(1))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].category").value("FOOD"));
        }

        @Test
        void list_filtersByDateRange() throws Exception {
                String bearer = newUserBearer();

                createExpense(bearer, expenseJson("10", "FOOD", "2026-10-10"));
                createExpense(bearer, expenseJson("20", "FOOD", "2026-09-02"));

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses")
                                .param("from", "2026-10-01")
                                .param("to", "2026-10-31")
                                .header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalElements").value(1));
        }

        @Test
        void list_withFromAfterTo_returns400() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses")
                                .param("from", "2026-10-31")
                                .param("to", "2026-10-01")
                                .header(AUTH, newUserBearer()))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        void list_withInvalidCategory_returns400() throws Exception {
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses")
                                .param("category", "ABC").header(AUTH, newUserBearer()))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        void update_changesTheValues() throws Exception {
                String bearer = newUserBearer();

                long id = createExpense(bearer, expenseJson("10", "FOOD", "2026-10-10"));

                mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/expenses/" + id)
                                .header(AUTH, bearer)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(expenseJson("99.99", "BILLS", "2026-10-11")))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.category").value("BILLS"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.expenseDate").value("2026-10-11"));
        }

        @Test
        void delete_removesTheExpenses() throws Exception {
                String bearer = newUserBearer();

                long id = createExpense(bearer, expenseJson("10", "FOOD", "2026-10-10"));

                mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/expenses/" + id).header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.status().isOk());

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses/" + id).header(AUTH, bearer))
                                .andExpect(MockMvcResultMatchers.status().isNotFound());
        }

        @Test
        void anotherUsersExpense_isInvisible_cannotBeEdited_andCannotBeDeleted() throws Exception {
                String owner = newUserBearer();
                String intruder = newUserBearer();

                long id = createExpense(owner, expenseJson("10", "FOOD", "2026-10-10"));

                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses/" + id).header(AUTH, intruder))
                                .andExpect(MockMvcResultMatchers.status().isNotFound());

                mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/expenses/" + id).header(AUTH, intruder)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(expenseJson("1", "FOOD", "2026-10-11")))
                                .andExpect(MockMvcResultMatchers.status().isNotFound());

                mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/expenses/" + id).header(AUTH, intruder))
                                .andExpect(MockMvcResultMatchers.status().isNotFound());

                // The owner's expense is untouched.
                mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/expenses/" + id).header(AUTH, owner))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

}
