package es.jose.economicallye.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "gastos_variables")
public class VariableExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "meta_id", nullable = true)
    private GoalSave goalSave;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double mount;

    @Column(nullable = false)
    private LocalDate date;
}
