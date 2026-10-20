package com.koushik.outspend.expense;

import java.time.YearMonth;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.koushik.outspend.support.IntegrationTestBase;

public class SummaryIntegrationTest extends IntegrationTestBase {
    private void addExpense(String bearer, String amount, String category, String date) throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/expenses")
                .header("Authorization", bearer)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"amount":%s,"category":"%s","expenseDate":"%s","note":"test"}
                        """.formatted(amount, category, date)))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    void monthly_totalsCategoriesAndPreviousMonth() throws Exception {
        String bearer = newUserBearer();
        YearMonth month = YearMonth.now();

        addExpense(bearer, "75.00", "FOOD", month.atDay(1).toString());
        addExpense(bearer, "25.00", "TRANSPORT", month.atDay(1).toString());
        addExpense(bearer, "40.00", "BILLS", month.minusMonths(1).atDay(1).toString());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/summary/monthly")
                .param("month", month.toString())
                .header("Authorization", bearer))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.month").value(month.toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalSpent").value(100.0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.previousMonthTotal").value(40.0))
                // biggest category first
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.byCategory[0].category").value("FOOD"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.byCategory[0].percentage").value(75.0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.byCategory[1].category").value("TRANSPORT"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.byCategory[1].percentage").value(25.0));
    }

    @Test
    void monthly_forAMonthWithNoExpenses_returnsZeros() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/summary/monthly")
                .param("month", "2001-01")
                .header("Authorization", newUserBearer()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalSpent").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.byCategory").isEmpty());
    }

    @Test
    void monthly_doesNotCountOtherUserExpenses() throws Exception {
        String other = newUserBearer();
        addExpense(other, "500.00", "SHOPPING", YearMonth.now().atDay(1).toString());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/summary/monthly")
                .header("Authorization", newUserBearer()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.totalSpent").value(0));
    }

    @Test
    void trend_returnsOneEntryPerMonth_oldestFirst_andCapsAtTwelve() throws Exception {
        String bearer = newUserBearer();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/summary/trend")
                .param("months", "3")
                .header("Authorization", bearer))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.length()").value(3))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data[2].month").value(YearMonth.now().toString()));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/summary/trend")
                .param("months", "99")
                .header("Authorization", bearer))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.length()").value(12));
    }
}
