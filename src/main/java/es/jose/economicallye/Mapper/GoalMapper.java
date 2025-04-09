package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.GoalDTO;
import es.jose.economicallye.Entity.Goal;
import es.jose.economicallye.Entity.VariableExpense;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        uses = {UserMapper.class, VariableExpenseMapper.class})

public interface GoalMapper {
    @Mapping(target = "relatedExpenseIds", source = "relatedExpenses")
    GoalDTO toDto(Goal goal);

    @Mapping(target = "relatedExpenses", ignore = true)
    Goal toEntity(GoalDTO goalDTO);

    default Set<Long> mapExpensesToIds(Set<VariableExpense> expenses) {
        if (expenses == null) return null;
        return expenses.stream().map(VariableExpense::getId).collect(Collectors.toSet());
    }
}