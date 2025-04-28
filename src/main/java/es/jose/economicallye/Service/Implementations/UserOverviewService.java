package es.jose.economicallye.Service.Implementations;
import es.jose.economicallye.Dto.*;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Mapper.AdviceMapper;
import es.jose.economicallye.Mapper.FixedExpenseMapper;
import es.jose.economicallye.Mapper.GoalMapper;
import es.jose.economicallye.Mapper.VariableExpenseMapper;
import es.jose.economicallye.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserOverviewService {

    private final UserRepository userRepository;
    private final FixedExpenseMapper fixedExpenseMapper;
    private final VariableExpenseMapper variableExpenseMapper;
    private final GoalMapper goalMapper;
    private final AdviceMapper adviceMapper;

    public UserOverviewDTO getUserOverview(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return UserOverviewDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .monthlyIncome(user.getMonthlyIncome())
                .fixedExpenses(fixedExpenseMapper.toDtoList(user.getFixedExpenses()))
                .variableExpenses(variableExpenseMapper.toDtoList(user.getVariableExpenses()))
                .goals(goalMapper.toDtoList(user.getGoals()))
                .advices(adviceMapper.toDtoList(user.getAdvices()))
                .build();
    }
}
