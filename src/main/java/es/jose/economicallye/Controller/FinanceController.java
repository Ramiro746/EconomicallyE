package es.jose.economicallye.Controller;

import es.jose.economicallye.Entity.Finance;
import es.jose.economicallye.Entity.Advice;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Repository.FinanceRepository;
import es.jose.economicallye.Repository.RecomendationRepository;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/finanzas")
public class FinanceController {

    @Autowired
    private FinanceRepository finanzasRepository;

    @Autowired
    private RecomendationRepository recomendacionRepository;

    @Autowired
    private UserRepository usuarioRepository;

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/{usuarioId}/analizar")//an
    public ResponseEntity<?> analyzeFinances(@PathVariable Long userId) {
        User user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Finance finance = finanzasRepository.findByUsuario(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Datos financieros no encontrados"));

        String result = openAiService.generarRecomendacion(finance);

        Advice recomendation = new Advice();
        recomendation.setUser(user);
        recomendation.setIAresult(result);
        recomendacionRepository.save(recomendation);

        return ResponseEntity.ok(recomendation);
    }
}
