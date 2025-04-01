package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.Finance;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {
    Optional<Finance> findByUsuario(User user);
}