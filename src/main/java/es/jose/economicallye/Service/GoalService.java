package es.jose.economicallye.Service;

import es.jose.economicallye.Dto.GoalDTO;

import java.util.List;

public interface GoalService {
    GoalDTO createGoal(GoalDTO goalDTO);
    List<GoalDTO> getGoalsByUserId(Long userId);
    GoalDTO updateGoal(Long id, GoalDTO goalDTO);
    void deleteGoal(Long id);
    GoalDTO addToSavedAmount(Long goalId, Double amount);
}
