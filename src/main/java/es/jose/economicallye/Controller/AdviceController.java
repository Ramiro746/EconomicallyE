package es.jose.economicallye.Controller;

import es.jose.economicallye.Dto.AdviceDTO;
import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;
import es.jose.economicallye.Service.AdviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advice")
@RequiredArgsConstructor
public class AdviceController {

    private final AdviceService adviceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdviceDTO generateAdvice(@RequestBody FinancialQuestionnaireDTO questionnaire) {
        return adviceService.generateAdvice(questionnaire);
    }

    @GetMapping("/{userId}")
    public List<AdviceDTO> getAdviceHistory(@PathVariable Long userId) {
        return adviceService.getAdviceHistory(userId);
    }

    @GetMapping("/progress/{userId}")
    public AdviceDTO generateProgressReport(@PathVariable Long userId) {
        return adviceService.generateProgressReport(userId);
    }
}
