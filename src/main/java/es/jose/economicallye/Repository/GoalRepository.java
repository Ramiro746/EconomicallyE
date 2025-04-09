package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
    List<Goal> findByUserId(Long userId);
}
