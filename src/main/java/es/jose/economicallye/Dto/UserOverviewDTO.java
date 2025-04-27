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
public class UserOverviewDTO {
    private Long userId;
    private String name;
    private Double monthlyIncome;

    private List<FixedExpenseDTO> fixedExpenses;
    private List<VariableExpenseDTO> variableExpenses;
    private List<GoalDTO> goals;
    private List<AdviceDTO> advices;
}
