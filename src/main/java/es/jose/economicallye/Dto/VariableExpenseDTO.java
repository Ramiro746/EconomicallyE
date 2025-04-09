package es.jose.economicallye.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariableExpenseDTO {
    private Long id;
    private Long userId;
    private String name;
    private Double amount;
    private LocalDate expenseDate;
    private String description;
    private Set<Long> affectedGoalIds;
}
