package es.jose.economicallye.Dto;

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
    private String name;
    private Double amount;
    private String frequency;
    private String description;
}
