package es.jose.economicallye.Service;

import es.jose.economicallye.Dto.MonthlyReportDTO;

import java.time.YearMonth;

public interface MonthlyReportService {
    MonthlyReportDTO generateMonthlyReport(Long userId, YearMonth month);
}