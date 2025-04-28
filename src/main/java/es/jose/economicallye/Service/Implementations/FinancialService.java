package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;
import es.jose.economicallye.Entity.FixedExpense;
import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Entity.VariableExpense;
import es.jose.economicallye.Exception.UserNotFoundException;
import es.jose.economicallye.Mapper.FixedExpenseMapper;
import es.jose.economicallye.Mapper.GoalMapper;
import es.jose.economicallye.Mapper.VariableExpenseMapper;
import es.jose.economicallye.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FinancialService {

    private final UserRepository userRepository;
    private final FixedExpenseMapper fixedExpenseMapper;
    private final VariableExpenseMapper variableExpenseMapper;
    private final GoalMapper goalMapper;

    public FinancialQuestionnaireDTO getFinancialData(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));
        
        Double plannedSavings = calculatePlannedSavings(user);
        String additionalContext = generateAdditionalContext(user);
        
        return FinancialQuestionnaireDTO.builder()
                .userId(user.getId())
                .monthlyIncome(user.getMonthlyIncome())
                .fixedExpenses(fixedExpenseMapper.toDtoList(getSafeFixedExpenses(user)))
                .variableExpenses(variableExpenseMapper.toDtoList(getSafeVariableExpenses(user)))
                .goals(goalMapper.toDtoList(getSafeGoals(user)))
                .plannedSavings(plannedSavings)
                .additionalContext(additionalContext)
                .build();
    }
    
    private List<FixedExpense> getSafeFixedExpenses(User user) {
        return Optional.ofNullable(user.getFixedExpenses()).orElse(Collections.emptyList());
    }
    
    private List<VariableExpense> getSafeVariableExpenses(User user) {
        return Optional.ofNullable(user.getVariableExpenses()).orElse(Collections.emptyList());
    }
    
    private List<Goal> getSafeGoals(User user) {
        return Optional.ofNullable(user.getGoals()).orElse(Collections.emptyList());
    }
    
    private Double calculatePlannedSavings(User user) {
        Double totalFixedExpenses = getSafeFixedExpenses(user).stream()
                .mapToDouble(FixedExpense::getAmount)
                .sum();
                
        Double totalVariableExpenses = getSafeVariableExpenses(user).stream()
                .mapToDouble(VariableExpense::getAmount)
                .sum();
                
        return user.getMonthlyIncome() - (totalFixedExpenses + totalVariableExpenses);
    }
    
    private String generateAdditionalContext(User user) {
        Double savingsRate = 0.0;
        if (user.getMonthlyIncome() > 0) {
            Double totalExpenses = calculateTotalExpenses(user);
            savingsRate = (user.getMonthlyIncome() - totalExpenses) / user.getMonthlyIncome() * 100;
        }
        
        return String.format("Tasa de ahorro: %.2f%%", savingsRate);
    }
    
    private Double calculateTotalExpenses(User user) {
        Double totalFixedExpenses = getSafeFixedExpenses(user).stream()
                .mapToDouble(FixedExpense::getAmount)
                .sum();
                
        Double totalVariableExpenses = getSafeVariableExpenses(user).stream()
                .mapToDouble(VariableExpense::getAmount)
                .sum();
                
        return totalFixedExpenses + totalVariableExpenses;
    }
}
