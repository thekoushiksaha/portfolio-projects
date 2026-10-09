package com.koushik.outspend.limit.service;

import java.time.YearMonth;
import java.util.List;

import com.koushik.outspend.limit.model.LimitRequest;
import com.koushik.outspend.limit.model.LimitResponse;

public interface LimitService {
    LimitResponse save(LimitRequest request);

    List<LimitResponse> list(YearMonth month);

    void delete(Long id);
}
