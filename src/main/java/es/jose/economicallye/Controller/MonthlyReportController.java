package es.jose.economicallye.Controller;


import es.jose.economicallye.Dto.MonthlyReportDTO;
import es.jose.economicallye.Service.MonthlyReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/monthly-report")
@RequiredArgsConstructor
@Tag(name = "Monthly Report", description = "Endpoints for financial report analysis")
public class MonthlyReportController {

    private final MonthlyReportService monthlyReportService;

    @Operation(summary = "Generate monthly report", description = "Returns financial summary for a given month")
    @GetMapping("/{userId}/{year}/{month}")
    public ResponseEntity<MonthlyReportDTO> getMonthlyReport(
            @PathVariable Long userId,
            @PathVariable int year,
            @PathVariable int month) {

        YearMonth yearMonth = YearMonth.of(year, month);
        MonthlyReportDTO report = monthlyReportService.generateMonthlyReport(userId, yearMonth);
        return ResponseEntity.ok(report);
    }
}