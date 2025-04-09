package es.jose.economicallye.Service.Ai;

import org.springframework.stereotype.Service;

@Service
public class OpenAiService {
    /*

    private final String apiKey = "TU_API_KEY";

    public String generarRecomendacion(Finance finanzas) {
        String prompt = "Un usuario gana " + finanzas.getMonthlyIncome() +
                " al mes, ha trabajado " + finanzas.getYearsWorking() +
                " años, tiene " + finanzas.getSavings() +
                " ahorrado y trabaja como " + finanzas.getJobType() +
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
    }*/
}
