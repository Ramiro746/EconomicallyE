package es.jose.economicallye.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReportDTO {
    private Long userId;
    private String userName;
    private Double monthlyIncome;
    private Double totalFixedExpenses;
    private Double totalVariableExpenses;
    private Double totalExpenses;
    private Double savedAmount;
    private Double savingPercentage;
    private List<GoalProgressDTO> goalsProgress;
}