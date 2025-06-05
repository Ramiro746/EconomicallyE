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

    @Mapping(target = "userId", source = "user.id")  // Mapeo explícito de user.id a userId
    AdviceDTO toDto(Advice entity);

    @Mapping(target = "user", ignore = true)  // Ignoramos el user ya que se manejará aparte
    Advice toEntity(AdviceDTO dto);

    // Simplificación del mapeo desde Questionnaire
    AdviceDTO toDtoFromQuestionnaire(FinancialQuestionnaireDTO dto);

    List<AdviceDTO> toDtoList(List<Advice> list);
    List<Advice> toEntityList(List<AdviceDTO> list);
}