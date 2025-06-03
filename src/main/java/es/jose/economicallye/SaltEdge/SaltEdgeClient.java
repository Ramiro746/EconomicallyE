package es.jose.economicallye.SaltEdge;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class SaltEdgeClient {
    private final String appId = "spQpHCwwyDOPdSNMib-zxz1SihOnmwXxU6D10u3YSz4";
    private final String secret = "kuboa3t9vXJyYSqTZPOZYH780FtQXZ5OxgqciHCjiDo";

    public HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("App-id", appId);
        headers.set("Secret", secret);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}