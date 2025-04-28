package es.jose.economicallye;

import es.jose.economicallye.Service.Implementations.OpenAIServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class OpenAIServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private OpenAIServiceImpl openAIService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializa los mocks
    }

    @Test
    public void testGetAIRecommendation() {
        // Simulamos la respuesta de la API
        String mockResponse = "Recomendación: Ahorra el 10% de tu ingreso mensual para tu viaje a Japón";

        // Simulamos el comportamiento del RestTemplate
        ResponseEntity<Map> responseEntity = ResponseEntity.ok(Map.of("choices", List.of(Map.of("text", mockResponse))));
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), (Class<Map>) any()))
                .thenReturn(responseEntity);

        // Ejecuta el método que estás probando
        String result = openAIService.getAIRecommendation("Recomendación financiera");

        // Asegúrate de que la respuesta mockeada sea la que se devuelve
        assertEquals(mockResponse, result);
    }
}

