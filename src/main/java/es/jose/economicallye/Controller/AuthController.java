package es.jose.economicallye.Controller;

import es.jose.economicallye.Dto.AuthRequestDTO;
import es.jose.economicallye.Dto.AuthResponseDTO;
import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtTokenProvider tokenProvider;



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


            String token = tokenProvider.generateToken(userDetails, user.getId(), user.getEmail(), user.getName());

            logger.info("Usuario autenticado: {} - Token generado: {}",  userDetails.getUsername(), token);
            logger.info("Nombre de usuario:"+(user.getName()));
            UserDTO userDTO = mapToUserDTO(user);
            return ResponseEntity.ok(new AuthResponseDTO(token, userDTO));

        } catch (Exception ex) {
            logger.error("Error de autenticación: " + ex.getMessage(), ex);
            return ResponseEntity.status(403).body("Credenciales inválidas");
        }
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                //.id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
