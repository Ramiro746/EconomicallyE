package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Entity.VariableExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VariableExpenseRepository extends JpaRepository<VariableExpense, Long> {
    List<VariableExpense> findByUser(User user);
    Optional<VariableExpense> findByIdAndUser(Long id, User user);
    void deleteByUser(User user);
}