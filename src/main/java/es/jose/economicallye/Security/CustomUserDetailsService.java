package es.jose.economicallye.Security;

import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Repository.UserRepository;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    /*
    private Long id;
    private String email;
    private String password;

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }


     */
    @Autowired
    private UserRepository userRepository;

    // Busca por email (para login)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword()
        );
    }

    // Opcional: buscar por ID si usas el ID en el token
    public UserDetails loadUserById(Long id) {
        System.out.println("Buscando usuario con ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + id));

        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword()
        );
    }
}
