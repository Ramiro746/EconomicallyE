package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.AdviceDTO;
import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;
import es.jose.economicallye.Entity.Advice;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface AdviceMapper {

    AdviceDTO toDto(Advice entity);
    Advice toEntity(AdviceDTO dto);

    // Actualiza el @Mapping para usar 'userId' en lugar de 'user.id'
    @Mapping(target = "userId", source = "userId")  // Aquí estamos mapeando correctamente userId
    @Mapping(target = "iaResult", ignore = true) // Este campo se genera después con la IA
    @Mapping(target = "recommendationDate", ignore = true) // Este campo se genera en el servicio
    AdviceDTO toDtoFromQuestionnaire(FinancialQuestionnaireDTO dto);

    List<AdviceDTO> toDtoList(List<Advice> list);
    List<Advice> toEntityList(List<AdviceDTO> list);
}
