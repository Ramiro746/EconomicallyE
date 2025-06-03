package es.jose.economicallye.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FixedExpenseDTO {
    private Long id;
    private Long userId;
    @NotBlank(message = "{fixedExpense.name.blank}")
    private String name;
    @NotNull(message = "{fixedExpense.amount.null}")
    @Positive(message = "{fixedExpense.amount.negative}")
    private Double amount;
    @NotBlank(message = "{fixedExpense.frequency.blank}")
    private String frequency;
    private String description;
}
