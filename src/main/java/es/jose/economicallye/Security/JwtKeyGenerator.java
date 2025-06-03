package es.jose.economicallye.Security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // Para HS256 (requiere mínimo 256 bits = 32 bytes)
        String keyHS256 = Encoders.BASE64.encode(
                Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );

        // Para HS512 (requiere mínimo 512 bits = 64 bytes - recomendado)
        String keyHS512 = Encoders.BASE64.encode(
                Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded()
        );

        System.out.println("Clave HS256: " + keyHS256);
        System.out.println("Clave HS512: " + keyHS512);
    }
}