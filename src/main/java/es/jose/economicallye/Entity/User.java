package es.jose.economicallye.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime registrationDate;

    @Column(nullable = false)
    private Double monthlyIncome;

    private String profession;

    // Relaciones
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FixedExpense> fixedExpenses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<VariableExpense> variableExpenses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Goal> goals;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Advice> advices;
}