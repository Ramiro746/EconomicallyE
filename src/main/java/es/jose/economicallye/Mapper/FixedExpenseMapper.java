package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.FixedExpenseDTO;
import es.jose.economicallye.Entity.FixedExpense;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        uses = UserMapper.class)

public interface FixedExpenseMapper {
    FixedExpenseDTO toDto(FixedExpense fixedExpense);
    FixedExpense toEntity(FixedExpenseDTO fixedExpenseDTO);
}