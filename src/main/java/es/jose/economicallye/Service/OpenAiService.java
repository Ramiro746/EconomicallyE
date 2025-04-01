package es.jose.economicallye.Service;

import es.jose.economicallye.Entity.Finance;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAiService {

    private final String apiKey = "TU_API_KEY";

    public String generarRecomendacion(Finance finanzas) {
        String prompt = "Un usuario gana " + finanzas.getIngresoMensual() +
                " al mes, ha trabajado " + finanzas.getAniosTrabajando() +
                " años, tiene " + finanzas.getAhorro() +
                " ahorrado y trabaja como " + finanzas.getTipoTrabajo() +
                ". Dame una recomendación financiera.";

        RestTemplate restTemplate = new RestTemplate();
        org.springframework.http.HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        String requestBody = "{ \"model\": \"gpt-4\", \"messages\": [{\"role\": \"user\", \"content\": \"" + prompt + "\"}]}";

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                request,
                String.class
        );

        return response.getBody();
    }
}
