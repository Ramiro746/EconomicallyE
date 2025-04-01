package es.jose.economicallye.Entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "finanzas")
public class Finance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private double ingresoMensual;

    @Column(nullable = false)
    private int aniosTrabajando;

    @Column(nullable = false)
    private double ahorro;

    @Column(nullable = false)
    private String tipoTrabajo;

}
