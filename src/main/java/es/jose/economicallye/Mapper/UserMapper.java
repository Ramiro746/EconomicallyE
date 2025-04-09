package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface UserMapper {
    UserDTO toDto(User entity);
    User toEntity(UserDTO dto);
}