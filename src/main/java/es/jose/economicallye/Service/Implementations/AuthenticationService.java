package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    private final UserDetailsService userDetailsService;


    public AuthenticationService(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtTokenProvider jwtTokenProvider,
                                 UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;

    }

    public String authenticateAndGenerateToken(String email, String rawPassword) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            //.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
                throw new RuntimeException("Contraseña incorrecta");
            }

            // 3. Obtener el ID del usuario (asumiendo que User implementa UserDetails)
            Long userId = null;
            if (userDetails instanceof User) {
                userId = ((User) userDetails).getId();
            }

            return jwtTokenProvider.generateToken(userDetails, userId);

        } catch (UsernameNotFoundException e) {
            throw new RuntimeException("Usuario no encontrado", e);
        }
    }
}
