package es.jose.economicallye.Security;

import es.jose.economicallye.Security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticatedUserProvider {

    private final JwtTokenProvider jwtTokenProvider;
    private final HttpServletRequest request;

    public Long getCurrentUserId() {
        String token = extractTokenFromRequest();
        if (token != null && jwtTokenProvider.validateToken(token)) {
            return jwtTokenProvider.extractUserId(token);
        }
        throw new RuntimeException("Usuario no autenticado o token inválido");
    }

    private String extractTokenFromRequest() {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
