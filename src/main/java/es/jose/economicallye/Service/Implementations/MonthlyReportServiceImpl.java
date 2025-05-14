package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.GoalProgressDTO;
import es.jose.economicallye.Dto.MonthlyReportDTO;
import es.jose.economicallye.Entity.FixedExpense;
import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Entity.VariableExpense;
import es.jose.economicallye.Repository.FixedExpenseRepository;
import es.jose.economicallye.Repository.GoalRepository;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Repository.VariableExpenseRepository;
import es.jose.economicallye.Service.MonthlyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonthlyReportServiceImpl implements MonthlyReportService {

    private final UserRepository userRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final VariableExpenseRepository variableExpenseRepository;
    private final GoalRepository goalRepository;

    @Override
    public MonthlyReportDTO generateMonthlyReport(Long userId, YearMonth month) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double income = user.getMonthlyIncome();

        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findByUserId(userId);
        List<VariableExpense> variableExpenses = variableExpenseRepository
                .findByUserIdAndExpenseDateBetween(
                        userId,
                        month.atDay(1),
                        month.atEndOfMonth()
                );

        double totalFixed = fixedExpenses.stream().mapToDouble(FixedExpense::getAmount).sum();
        double totalVariable = variableExpenses.stream().mapToDouble(VariableExpense::getAmount).sum();
        double totalExpenses = totalFixed + totalVariable;
        double savedAmount = income - totalExpenses;
        double savingPercentage = (income == 0) ? 0 : (savedAmount / income) * 100;

        List<Goal> goals = goalRepository.findByUserId(userId);
        List<GoalProgressDTO> goalProgress = goals.stream().map(goal -> GoalProgressDTO.builder()
                .goalId(goal.getId())
                .description(goal.getDescription())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .progressPercentage((goal.getTargetAmount() == 0) ? 0 : (goal.getSavedAmount() / goal.getTargetAmount()) * 100)
                .build()).collect(Collectors.toList());

        return MonthlyReportDTO.builder()
                .userId(user.getId())
                .userName(user.getName())
                .monthlyIncome(income)
                .totalFixedExpenses(totalFixed)
                .totalVariableExpenses(totalVariable)
                .totalExpenses(totalExpenses)
                .savedAmount(savedAmount)
                .savingPercentage(savingPercentage)
                .goalsProgress(goalProgress)
                .build();
    }
}