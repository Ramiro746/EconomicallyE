package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.FixedExpense;
import es.jose.economicallye.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {
    List<FixedExpense> findByUser(User user);
    Optional<FixedExpense> findByIdAndUser(Long id, User user);
    void deleteByUser(User user);
}