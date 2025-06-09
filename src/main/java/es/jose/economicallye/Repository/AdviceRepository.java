package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.Advice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdviceRepository extends JpaRepository<Advice, Long> {
    List<Advice> findByUserIdOrderByRecommendationDateDesc(Long userId);
    Optional<Advice> findTopByUserIdOrderByRecommendationDateDesc(Long userId);
}