package es.jose.economicallye.Repository;
import es.jose.economicallye.Entity.Advice;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecomendationRepository extends JpaRepository<Advice, Long> {
    List<Advice> findByUsuario(User user);
}
