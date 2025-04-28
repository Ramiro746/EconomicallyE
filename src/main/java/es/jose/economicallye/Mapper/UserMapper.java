package es.jose.economicallye.Mapper;

import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface UserMapper {
    UserDTO toDto(User entity);
    User toEntity(UserDTO dto);

    List<UserDTO> toDtoList(List<User> list);
    List<User> toEntityList(List<UserDTO> list);

}