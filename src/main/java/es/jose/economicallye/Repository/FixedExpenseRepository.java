package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.FixedExpense;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {
    List<FixedExpense> findByUser(User user);
    List<FixedExpense> findByUserId(Long userId);
}