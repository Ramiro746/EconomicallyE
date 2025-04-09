package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.Advice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AdviceRepository extends JpaRepository<Advice, Long> {
    List<Advice> findByUserIdOrderByRecommendationDateDesc(Long userId);
}
