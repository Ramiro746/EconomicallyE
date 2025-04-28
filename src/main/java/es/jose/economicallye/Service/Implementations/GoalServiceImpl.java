package es.jose.economicallye.Service.Implementations;


import es.jose.economicallye.Dto.GoalDTO;
import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Entity.VariableExpense;
import es.jose.economicallye.Mapper.GoalMapper;
import es.jose.economicallye.Repository.GoalRepository;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Repository.VariableExpenseRepository;
import es.jose.economicallye.Service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final VariableExpenseRepository variableExpenseRepository;
    private final GoalMapper goalMapper;

    @Override
    public GoalDTO createGoal(GoalDTO goalDTO) {
        User user = userRepository.findById(goalDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Goal goal = goalMapper.toEntity(goalDTO);
        goal.setUser(user);

        if (goalDTO.getRelatedExpenseIds() != null && !goalDTO.getRelatedExpenseIds().isEmpty()) {
            Set<VariableExpense> expenses = new HashSet<>(variableExpenseRepository.findAllById(goalDTO.getRelatedExpenseIds()));
            goal.setRelatedExpenses(expenses);
        }

        goal = goalRepository.save(goal);
        return goalMapper.toDto(goal);
    }

    @Override
    public List<GoalDTO> getGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId).stream()
                .map(goalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public GoalDTO updateGoal(Long id, GoalDTO goalDTO) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setDescription(goalDTO.getDescription());
        goal.setTargetAmount(goalDTO.getTargetAmount());
        goal.setSavedAmount(goalDTO.getSavedAmount());
        goal.setDeadline(goalDTO.getDeadline());

        if (goalDTO.getRelatedExpenseIds() != null) {
            Set<VariableExpense> expenses = new HashSet<>(variableExpenseRepository.findAllById(goalDTO.getRelatedExpenseIds()));
            goal.setRelatedExpenses(expenses);
        }

        goal = goalRepository.save(goal);
        return goalMapper.toDto(goal);
    }

    @Override
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }

    @Override
    public GoalDTO addToSavedAmount(Long goalId, Double amount) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setSavedAmount(goal.getSavedAmount() + amount);
        goal = goalRepository.save(goal);
        return goalMapper.toDto(goal);
    }
}