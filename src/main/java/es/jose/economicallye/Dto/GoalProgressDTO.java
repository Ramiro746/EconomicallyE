package es.jose.economicallye.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalProgressDTO {
    private Long goalId;
    private String description;
    private Double targetAmount;
    private Double savedAmount;
    private Double progressPercentage;
}