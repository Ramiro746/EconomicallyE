package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.FixedExpenseDTO;
import es.jose.economicallye.Entity.FixedExpense;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface FixedExpenseMapper {

    @Mapping(source = "user.id", target = "userId")
    FixedExpenseDTO toDto(FixedExpense entity);

    FixedExpense toEntity(FixedExpenseDTO dto);

    List<FixedExpenseDTO> toDtoList(List<FixedExpense> list);
    List<FixedExpense> toEntityList(List<FixedExpenseDTO> list);
}