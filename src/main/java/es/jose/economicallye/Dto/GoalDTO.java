package es.jose.economicallye.Dto;

import jakarta.validation.constraints.*;
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
public class GoalDTO {
    private Long id;
    private Long userId;
    @NotBlank(message = "{goal.description.blank}")
    private String description;
    @NotNull(message = "{goal.targetAmount.null}")
    @Positive(message = "{goal.targetAmount.invalid}")
    private Double targetAmount;
    @NotNull(message = "{goal.savedAmount.null}")
    @PositiveOrZero(message = "{goal.savedAmount.invalid}")
    private Double savedAmount;
    @NotNull(message = "{goal.deadline.null}")
    @FutureOrPresent(message = "{goal.deadline.past}")
    private LocalDate deadline;
    private Set<Long> relatedExpenseIds;
}
