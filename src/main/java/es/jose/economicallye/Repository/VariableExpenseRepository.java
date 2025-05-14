package es.jose.economicallye.Repository;

import es.jose.economicallye.Entity.VariableExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VariableExpenseRepository extends JpaRepository<VariableExpense, Long> {
    List<VariableExpense> findByUserId(Long userId);
    List<VariableExpense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

}