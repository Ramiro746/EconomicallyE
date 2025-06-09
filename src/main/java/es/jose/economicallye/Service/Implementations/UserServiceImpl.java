package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Exception.EmailAlreadyExistsException;
import es.jose.economicallye.Exception.UserNotFoundException;
import es.jose.economicallye.Mapper.UserMapper;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final MessageSource messageSource;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, BCryptPasswordEncoder passwordEncoder, MessageSource messageSource) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.messageSource = messageSource;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("Los datos del usuario no pueden ser nulos");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new EmailAlreadyExistsException(
                    messageSource.getMessage("user.email.duplicate", null, LocaleContextHolder.getLocale())
            );
        }
        User user = userMapper.toEntity(userDTO);

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(encodedPassword);
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

        // Si la contraseña está presente en el DTO, cifrarla antes de actualizarla
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
            user.setPassword(encodedPassword);
        }

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


    @Override
    public UserDTO updateUserIncome(Long id, Double newIncome) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setMonthlyIncome(newIncome);

        User updatedUser = userRepository.save(user);

        return userMapper.toDto(updatedUser);  // Usa tu mapper
    }

    @Override
    public UserDTO getCurrentUserId() {
        return null;
    }
}
