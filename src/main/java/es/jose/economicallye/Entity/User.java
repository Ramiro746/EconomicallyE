package es.jose.economicallye.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Finance> finances;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<VariableExpense> expenses;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<GoalSave> metasAhorro;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Advice> recomendations;
}

