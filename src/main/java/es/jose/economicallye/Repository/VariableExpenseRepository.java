package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.VariableExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VariableExpenseRepository extends JpaRepository<VariableExpense, Long> {
    List<VariableExpense> findByUserId(Long userId);
}