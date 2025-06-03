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

        // Obtener recomendación de IA
        String iaResult = aiService.getAIRecommendation(prompt);

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

        prompt.append("Eres un asesor financiero experto con un enfoque en coaching financiero. Tu objetivo es proporcionar recomendaciones extremadamente prácticas y personalizadas que ayuden al usuario a optimizar sus finanzas.\n\n");

        prompt.append("### INSTRUCCIONES PRINCIPALES ###\n");
        prompt.append("1. Analiza cada categoría de gastos para identificar oportunidades de ahorro.\n");
        prompt.append("2. Proporciona alternativas concretas para reducir gastos sin sacrificar calidad de vida.\n");
        prompt.append("3. Compara los gastos actuales con benchmark de gastos recomendados para su perfil.\n");
        prompt.append("4. Sugiere estrategias para acelerar el cumplimiento de metas de ahorro.\n");
        prompt.append("5. Explica el impacto a largo plazo de cada recomendación.\n\n");

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

        prompt.append("\n### RECOMENDACIONES CLAVE ###\n");
        prompt.append("- Usa un tono de coach financiero, motivador pero realista.\n");
        prompt.append("- Si detectas que hay un gasto que ya esta optimizado, RECONÓCELO y NO sugieras cambios genéricos.\n");
        prompt.append("- Cada recomendación debe incluir:\n");
        prompt.append("  a) Cantidad exacta de ahorro potencial\n");
        prompt.append("  b) Estrategia específica para lograrlo\n");
        prompt.append("  c) Impacto en metas de ahorro\n");

        prompt.append("\nTu respuesta debe estar bien organizada con subtítulos, cálculos estimados, y recomendaciones detalladas, como lo haría un asesor financiero humano.");

        return prompt.toString();
    }

    ////////

    @Override
    public AdviceDTO generateProgressReport(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        // Obtener historial de consejos
        List<Advice> adviceHistory = adviceRepository.findByUserIdOrderByRecommendationDateDesc(userId);

        if (adviceHistory.isEmpty()) {
            throw new IllegalStateException("No hay historial de consejos para este usuario");
        }

        // Preparar prompt para análisis de progreso
        String progressPrompt = buildProgressPrompt(user, adviceHistory);

        // Obtener análisis de progreso de IA
        String progressAnalysis = aiService.getAIRecommendation(progressPrompt);

        // Guardar nuevo consejo de progreso
        Advice progressAdvice = new Advice();
        progressAdvice.setUser(user);
        progressAdvice.setIaResult(progressAnalysis);
        progressAdvice.setRecommendationDate(LocalDateTime.now());
        progressAdvice = adviceRepository.save(progressAdvice);

        return adviceMapper.toDto(progressAdvice);
    }

    private String buildProgressPrompt(User user, List<Advice> adviceHistory) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Eres un asesor financiero experto en seguimiento de progreso financiero. Analiza el historial de recomendaciones financieras de este usuario.\n\n");

        prompt.append("### INFORMACIÓN DEL USUARIO ###\n");
        prompt.append("Nombre: ").append(user.getName()).append("\n");
        prompt.append("Ingresos mensuales: ").append(user.getMonthlyIncome()).append(" €\n\n");

        prompt.append("### HISTORIAL DE RECOMENDACIONES ###\n");
        for (int i = 0; i < Math.min(adviceHistory.size(), 3); i++) {
            Advice advice = adviceHistory.get(i);
            prompt.append("Recomendación ").append(i + 1).append(" (").append(advice.getRecommendationDate()).append("):\n");
            prompt.append(advice.getIaResult()).append("\n\n");
        }

        prompt.append("### TAREA ###\n");
        prompt.append("1. Evalúa el progreso del usuario basándote en recomendaciones anteriores.\n");
        prompt.append("2. Identifica mejoras logradas y áreas que requieren más atención.\n");
        prompt.append("3. Calcula el porcentaje de implementación de consejos previos.\n");
        prompt.append("4. Proporciona motivación y estrategias actualizadas.\n");
        prompt.append("5. Destaca logros específicos y áreas de oportunidad.\n");

        return prompt.toString();
    }
}