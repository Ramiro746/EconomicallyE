/*
package es.jose.economicallye.Controller;

import es.jose.economicallye.Service.Implementations.SaltEdgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SaltController {

    private final SaltEdgeService saltEdgeService;

    @GetMapping("/saltedge/connect")
    public ResponseEntity<Map<String, String>> getConnectUrl() {
        String connectUrl = saltEdgeService.createConnectSession(); // este método llama a Salt Edge
        return ResponseEntity.ok(Map.of("url", connectUrl));
    }

}

 */
