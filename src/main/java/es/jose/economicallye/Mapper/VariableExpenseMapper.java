package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.VariableExpenseDTO;
import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.VariableExpense;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        uses = {UserMapper.class, GoalMapper.class})

public interface VariableExpenseMapper {
    @Mapping(target = "affectedGoalIds", source = "affectedGoals")
    VariableExpenseDTO toDto(VariableExpense variableExpense);

    @Mapping(target = "affectedGoals", ignore = true)
    VariableExpense toEntity(VariableExpenseDTO variableExpenseDTO);

    default Set<Long> mapGoalsToIds(Set<Goal> goals) {
        if (goals == null) return null;
        return goals.stream().map(Goal::getId).collect(Collectors.toSet());
    }
}