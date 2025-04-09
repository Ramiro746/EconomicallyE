package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.AdviceDTO;
import es.jose.economicallye.Entity.Advice;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        uses = UserMapper.class)
public interface AdviceMapper {
    AdviceDTO toDto(Advice advice);
    Advice toEntity(AdviceDTO adviceDTO);
}
