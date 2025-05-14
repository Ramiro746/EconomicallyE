package es.jose.economicallye.Config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "EconomicallyE API", version = "1.0", description = "Documentation for EconomicallyE App")
)
public class SwaggerConfig {
    // http://localhost:8080/swagger-ui/index.html
    // http://localhost:8080/v3/api-docs
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new io.swagger.v3.oas.models.info.Info().title("EconomicallyE API").version("1.0"));
    }
}