package es.jose.economicallye.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialQuestionnaireDTO {
    private Long userId;
    @NotNull(message = "{questionnaire.income.null}")
    @PositiveOrZero(message = "{questionnaire.income.invalid}")
    private Double monthlyIncome;
    private List<FixedExpenseDTO> fixedExpenses;
    private List<VariableExpenseDTO> variableExpenses;
    private List<GoalDTO> goals;
    private Double plannedSavings;
    private String additionalContext;
}