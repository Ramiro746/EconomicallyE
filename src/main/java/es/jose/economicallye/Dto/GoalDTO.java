package es.jose.economicallye.Dto;

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
    private String name;
    private String description;
    private Double targetAmount;
    private Double savedAmount;
    private LocalDate deadline;
    private Set<Long> relatedExpenseIds;
}
