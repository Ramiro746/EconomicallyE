package es.jose.economicallye.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDTO {
    @NotBlank(message = "{auth.email.blank}")
    @Email(message = "{auth.email.invalid}")
    private String email;
    @NotBlank(message = "{auth.password.blank}")
    @Size(min = 8, message = "{user.password.tooShort}")
    private String password;

}
