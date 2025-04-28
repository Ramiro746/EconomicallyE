package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.VariableExpenseDTO;
import es.jose.economicallye.Entity.VariableExpense;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VariableExpenseMapper {

    @Mapping(source = "userId", target = "user.id") // Aseguramos que se mapea el userId
    VariableExpense toEntity(VariableExpenseDTO dto);

    @Mapping(source = "user.id", target = "userId") // Para devolver el userId en el DTO
    VariableExpenseDTO toDto(VariableExpense entity);

    List<VariableExpenseDTO> toDtoList(List<VariableExpense> list);

    List<VariableExpense> toEntityList(List<VariableExpenseDTO> list);
}
