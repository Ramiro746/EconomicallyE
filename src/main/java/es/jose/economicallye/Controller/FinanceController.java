package es.jose.economicallye.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/finanzas")
public class FinanceController {
/* Aun estamos viendo si implementar deepseek o openAI

    @Autowired
    private FinanceRepository finanzasRepository;

    @Autowired
    private RecomendationRepository recomendacionRepository;

    @Autowired
    private UserRepository usuarioRepository;

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/{usuarioId}/analizar")
    public ResponseEntity<?> analyzeFinances(@PathVariable Long userId) {
        User user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Finance finance = finanzasRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Datos financieros no encontrados"));

        String result = openAiService.generarRecomendacion(finance);

        Advice recomendation = new Advice();
        recomendation.setUser(user);
        recomendation.setIaResult(result);
        recomendacionRepository.save(recomendation);

        return ResponseEntity.ok(recomendation);
    }*/
}
