/*
package es.jose.economicallye.Service.Implementations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SaltEdgeService {

    private final RestTemplate restTemplate;

    @Value("${saltedge.app_id}")
    private String appId;

    @Value("${saltedge.secret}")
    private String secret;

    public SaltEdgeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("App-id", appId);
        headers.set("Secret", secret);
        headers.set("Accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }


    public String createConnectSession() {
        String url = "https://www.saltedge.com/api/v5/connect_sessions/create";

        Map<String, Object> body = new HashMap<>();
        body.put("customer_id", "test_user_" + UUID.randomUUID()); // o tu propio ID
        body.put("country_code", "ES");
        body.put("provider_codes", List.of("fake_oauth_bank_eu")); // banco sandbox
        body.put("consent", Map.of("scopes", List.of("account_details", "transactions")));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("data", body), buildHeaders());

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        return data.get("connect_url").toString();
    }


    public List<Map<String, Object>> getTransactions(String connectionId) {
        String url = "https://www.saltedge.com/api/v5/transactions?connection_id=" + connectionId;

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return (List<Map<String, Object>>) response.getBody().get("data");
    }

    public List<Map<String, Object>> getAccounts(String connectionId) {
        String url = "https://www.saltedge.com/api/v5/accounts?connection_id=" + connectionId;

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return (List<Map<String, Object>>) response.getBody().get("data");
    }

}

 */