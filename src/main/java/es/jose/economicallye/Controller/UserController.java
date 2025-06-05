package es.jose.economicallye.Controller;

import es.jose.economicallye.Dto.UserDTO;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Security.CustomUserDetails;
import es.jose.economicallye.Security.CustomUserDetailsService;
import es.jose.economicallye.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@Valid @PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //Metodo pa cambiar solo la mnda del Salario
    @PatchMapping("/{id}/income")
    public ResponseEntity<UserDTO> updateUserIncome(
            @PathVariable Long id,
            @RequestBody Map<String, Double> update,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (!userDetails.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Double newIncome = update.get("monthlyIncome");
        return ResponseEntity.ok(userService.updateUserIncome(id, newIncome));
    }
    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return new UserDTO(userDetails.getId(), userDetails.getUsername(), userDetails.getName());

    }
}
