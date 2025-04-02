package es.jose.economicallye.Repository;
import es.jose.economicallye.Entity.Advice;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecomendationRepository extends JpaRepository<Advice, Long> {
    List<Advice> findByUser(User user);
    Optional<Advice> findByIdAndUser(Long id, User user);
    void deleteByUser(User user);
}
