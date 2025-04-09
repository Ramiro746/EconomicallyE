package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;
import es.jose.economicallye.Entity.User;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED,
        uses = {FixedExpenseMapper.class, VariableExpenseMapper.class, GoalMapper.class}
)
public interface FinancialMapper {
    @Mapping(target = "monthlyIncome", source = "monthlyIncome")
    @Mapping(target = "fixedExpenses", source = "fixedExpenses")
    @Mapping(target = "variableExpenses", source = "variableExpenses")
    @Mapping(target = "goals", source = "goals")
    FinancialQuestionnaireDTO toDto(User entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "advices", ignore = true)
    User toEntity(FinancialQuestionnaireDTO dto);
}