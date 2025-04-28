package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Exception.UserNotFoundException;
import es.jose.economicallye.Mapper.UserMapper;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("Los datos del usuario no pueden ser nulos");
        }

        User user = userMapper.toEntity(userDTO);

        // Establecer la fecha actual de registro directamente en la entidad
        user.setRegistrationDate(LocalDateTime.now());

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }


    @Override
    public UserDTO getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        if (id == null || userDTO == null) {
            throw new IllegalArgumentException("El ID de usuario y los datos no pueden ser nulos");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + id));

        // Actualizar solo los campos que deben ser actualizables
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setMonthlyIncome(userDTO.getMonthlyIncome());

        // No actualizamos la contraseña aquí - esto debería hacerse en un servicio específico
        // con la validación y encriptación adecuadas

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        // Verificar si el usuario existe antes de intentar eliminarlo
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuario no encontrado con ID: " + id);
        }

        userRepository.deleteById(id);
    }
}
