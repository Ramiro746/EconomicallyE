package es.jose.economicallye.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "metas_ahorro")
public class GoalSave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double ObjetiveMount;

    @Column(nullable = false)
    private Double SavedMount;

    @Column(nullable = false)
    private LocalDate GoalDate;

    @OneToMany(mappedBy = "metaAhorro", cascade = CascadeType.ALL)
    private List<VariableExpense> RelationalExpenses;
}
