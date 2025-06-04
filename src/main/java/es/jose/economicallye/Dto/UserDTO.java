package es.jose.economicallye.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    @Email(message = "{user.email.invalid}")
    @NotBlank(message = "{user.email.blank}")
    private String email;
    @NotBlank(message = "{user.password.blank}")
    @Size(min = 8, message = "{user.password.tooShort}")
    private String password;
    @NotBlank(message = "{user.name.blank}")
    private String name;
    private LocalDate registrationDate;
    @NotNull(message = "{user.income.null}")
    @PositiveOrZero(message = "{user.income.negative}")
    private Double monthlyIncome;

    public UserDTO(Long id, String email) {
        this.id = id;
        this.email = email;
    }

    public UserDTO(Long id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}