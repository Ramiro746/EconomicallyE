package es.jose.economicallye.Dto;

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
    private String email;
    private String password;
    private String name;
    private LocalDate registrationDate; //LocalDateTime muestra la hora tambien
    private Double monthlyIncome;

    // ✅ Constructor adicional solo con id y email
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