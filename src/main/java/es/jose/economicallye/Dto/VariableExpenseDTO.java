package es.jose.economicallye.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariableExpenseDTO {
    private Long id;
    private Long userId;
    @NotBlank(message = "{variableExpense.name.blank}")
    private String name;
    @NotNull(message = "{variableExpense.amount.null}")
    @Positive(message = "{variableExpense.amount.negative}")
    private Double amount;
    @NotNull(message = "{variableExpense.date.null}")
    @PastOrPresent(message = "{variableExpense.date.future}")
    private LocalDate expenseDate;
    private String description;
    private Set<Long> affectedGoalIds;
}
