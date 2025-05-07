package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.AdviceDTO;
import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;
import es.jose.economicallye.Entity.*;
import es.jose.economicallye.Exception.UserNotFoundException;
import es.jose.economicallye.Mapper.AdviceMapper;
import es.jose.economicallye.Repository.*;
import es.jose.economicallye.Service.AIService;
import es.jose.economicallye.Service.AdviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdviceServiceImpl implements AdviceService {
    private final UserRepository userRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final VariableExpenseRepository variableExpenseRepository;
    private final GoalRepository goalRepository;
    private final AdviceRepository adviceRepository;
    private final AdviceMapper adviceMapper;
    private final AIService aiService;

    @Override
    public AdviceDTO generateAdvice(FinancialQuestionnaireDTO questionnaire) {
        if (questionnaire.getUserId() == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        User user = userRepository.findById(questionnaire.getUserId())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + questionnaire.getUserId()));

        // Obtener datos del usuario para la recomendación
        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findByUserId(user.getId());
        List<VariableExpense> variableExpenses = variableExpenseRepository.findByUserId(user.getId());
        List<Goal> goals = goalRepository.findByUserId(user.getId());

        // Generar prompt para IA
        String prompt = buildPrompt(user, fixedExpenses, variableExpenses, goals, questionnaire.getPlannedSavings());

        System.out.println("Prompt enviado"+ prompt);
        // Obtener recomendación de IA
        String iaResult = aiService.getAIRecommendation(prompt);

        System.out.println("Resultado de la IA"+ iaResult);


        // Guardar el consejo
        Advice advice = new Advice();
        advice.setUser(user);
        advice.setIaResult(iaResult);
        advice.setRecommendationDate(LocalDateTime.now());
        advice = adviceRepository.save(advice);

        // Mapear el resultado al DTO adecuado
        AdviceDTO adviceDTO = adviceMapper.toDto(advice);
        return adviceDTO;
    }


    @Override
    public List<AdviceDTO> getAdviceHistory(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        // Verificar si el usuario existe
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        return adviceRepository.findByUserIdOrderByRecommendationDateDesc(userId).stream()
                .map(adviceMapper::toDto)
                .collect(Collectors.toList());
    }

    private String buildPrompt(User user, List<FixedExpense> fixedExpenses,
                               List<VariableExpense> variableExpenses,
                               List<Goal> goals, Double plannedSavings) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Eres un asesor financiero experto. Analiza detalladamente la situación económica del siguiente usuario y genera un plan de ahorro personalizado, preciso y accionable. Debes calcular el total de ingresos, gastos (fijos y variables) y mostrar cuánto puede ahorrar al mes. Considera también cuánto tiempo tardará en alcanzar cada una de sus metas de ahorro, en base a sus ahorros actuales y posibles ajustes.\n\n");

        prompt.append("### DATOS DEL USUARIO ###\n");
        prompt.append("Nombre: ").append(user.getName()).append("\n");
        prompt.append("Ingresos mensuales: ").append(user.getMonthlyIncome()).append(" €\n");

        prompt.append("\n### GASTOS FIJOS ###\n");
        fixedExpenses.forEach(fe -> prompt.append("- ").append(fe.getName())
                .append(": ").append(fe.getAmount()).append(" € (").append(fe.getFrequency()).append("). Descripción: ").append(fe.getDescription()).append("\n"));

        prompt.append("\n### GASTOS VARIABLES DEL ÚLTIMO MES ###\n");
        variableExpenses.forEach(ve -> prompt.append("- ").append(ve.getName())
                .append(": ").append(ve.getAmount()).append(" € (").append(ve.getExpenseDate()).append("). Descripción: ").append(Optional.ofNullable(ve.getDescription()).orElse("Sin descripción")).append("\n"));

        prompt.append("\n### OBJETIVOS DE AHORRO ###\n");
        goals.forEach(g -> prompt.append("- ").append(g.getDescription())
                .append(": Meta = ").append(g.getTargetAmount()).append(" €, Ahorrado = ").append(g.getSavedAmount())
                .append(" €, Fecha límite = ").append(g.getDeadline()).append("\n"));

        if (plannedSavings != null) {
            prompt.append("\nAhorro mensual planificado: ").append(plannedSavings).append(" €\n");
        }

        prompt.append("\n### TAREA PARA TI (IA) ###\n");
        prompt.append("1. Calcula el total de gastos fijos y variables.\n");
        prompt.append("2. Calcula cuánto le queda disponible al mes y si el ahorro planificado es viable.\n");
        prompt.append("3. Propón ajustes específicos en los gastos, con cantidades claras y justificaciones.\n");
        prompt.append("4. Estima cuánto tardará en cumplir cada meta si mantiene (o mejora) su ahorro actual.\n");
        prompt.append("5. Presenta todo en un formato claro, estructurado, profesional y fácil de leer.\n");

        prompt.append("\nTu respuesta debe estar bien organizada con subtítulos, cálculos estimados, y recomendaciones detalladas, como lo haría un asesor financiero humano.");

        return prompt.toString();
    }
}