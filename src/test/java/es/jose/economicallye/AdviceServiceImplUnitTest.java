package es.jose.economicallye;

import es.jose.economicallye.Dto.*;
import es.jose.economicallye.Entity.*;
import es.jose.economicallye.Exception.UserNotFoundException;
import es.jose.economicallye.Mapper.AdviceMapper;
import es.jose.economicallye.Repository.*;
import es.jose.economicallye.Service.AIService;
import es.jose.economicallye.Service.Implementations.AdviceServiceImpl;
import es.jose.economicallye.Service.Implementations.FixedExpenseServiceImpl;
import es.jose.economicallye.Service.Implementations.GoalServiceImpl;
import es.jose.economicallye.Service.Implementations.VariableExpenseServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdviceServiceImplUnitTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private FixedExpenseRepository fixedExpenseRepository;
    @Mock
    private VariableExpenseRepository variableExpenseRepository;
    @Mock
    private GoalRepository goalRepository;
    @Mock
    private AdviceRepository adviceRepository;
    @Mock
    private AdviceMapper adviceMapper;
    @Mock
    private AIService aiService;
    @InjectMocks
    private AdviceServiceImpl adviceService;
    @InjectMocks
    private FixedExpenseServiceImpl fixedExpenseService;
    @InjectMocks
    private VariableExpenseServiceImpl variableExpenseService;
    @InjectMocks
    private GoalServiceImpl goalService;

    @Test
    void generateAdvice_validQuestionnaire_shouldReturnAdviceDTO() {

        Long userId = 1L;
        FinancialQuestionnaireDTO questionnaire = FinancialQuestionnaireDTO.builder().userId(userId).plannedSavings(100.0).build();
        User user = User.builder().id(userId).name("Test User").monthlyIncome(3000.0).build();
        List<FixedExpense> fixedExpenses = Collections.singletonList(FixedExpense.builder().id(1L).user(user).name("Rent").amount(1000.0).frequency("Monthly").build());
        List<VariableExpense> variableExpenses = Collections.singletonList(VariableExpense.builder().id(1L).user(user).name("Groceries").amount(300.0).expenseDate(LocalDate.now()).build());
        List<Goal> goals = Collections.singletonList(Goal.builder().id(1L).user(user).description("New Laptop").targetAmount(1500.0).savedAmount(500.0).deadline(LocalDate.now().plusMonths(6)).build());
        String aiRecommendation = "Genial consejo";
        Advice savedAdvice = Advice.builder().id(1L).user(user).iaResult(aiRecommendation).recommendationDate(LocalDateTime.now()).build();
        AdviceDTO expectedAdviceDTO = AdviceDTO.builder().id(1L).userId(userId).iaResult(aiRecommendation).recommendationDate(savedAdvice.getRecommendationDate()).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(fixedExpenseRepository.findByUserId(userId)).thenReturn(fixedExpenses);
        when(variableExpenseRepository.findByUserId(userId)).thenReturn(variableExpenses);
        when(goalRepository.findByUserId(userId)).thenReturn(goals);
        when(aiService.getAIRecommendation(anyString())).thenReturn(aiRecommendation);
        when(adviceRepository.save(any(Advice.class))).thenReturn(savedAdvice);
        when(adviceMapper.toDto(savedAdvice)).thenReturn(expectedAdviceDTO);

        AdviceDTO actualAdviceDTO = adviceService.generateAdvice(questionnaire);

        assertNotNull(actualAdviceDTO);
        assertEquals(expectedAdviceDTO.getId(), actualAdviceDTO.getId());
        assertEquals(expectedAdviceDTO.getUserId(), actualAdviceDTO.getUserId());
        assertEquals(expectedAdviceDTO.getIaResult(), actualAdviceDTO.getIaResult());
        assertEquals(expectedAdviceDTO.getRecommendationDate().toLocalDate(), actualAdviceDTO.getRecommendationDate().toLocalDate());
        verify(userRepository, times(1)).findById(userId);
        verify(fixedExpenseRepository, times(1)).findByUserId(userId);
        verify(variableExpenseRepository, times(1)).findByUserId(userId);
        verify(goalRepository, times(1)).findByUserId(userId);
        verify(aiService, times(1)).getAIRecommendation(anyString());
        verify(adviceRepository, times(1)).save(any(Advice.class));
        verify(adviceMapper, times(1)).toDto(savedAdvice);
    }

    @Test
    void generateAdvice_nullUserId_shouldThrowIllegalArgumentException() {

        FinancialQuestionnaireDTO questionnaire = FinancialQuestionnaireDTO.builder().build();

        assertThrows(IllegalArgumentException.class, () -> adviceService.generateAdvice(questionnaire));
        verifyNoInteractions(userRepository);
        verifyNoInteractions(fixedExpenseRepository);
        verifyNoInteractions(variableExpenseRepository);
        verifyNoInteractions(goalRepository);
        verifyNoInteractions(aiService);
        verifyNoInteractions(adviceRepository);
        verifyNoInteractions(adviceMapper);
    }

    @Test
    void generateAdvice_userNotFound_shouldThrowUserNotFoundException() {

        Long userId = 1L;
        FinancialQuestionnaireDTO questionnaire = FinancialQuestionnaireDTO.builder().userId(userId).plannedSavings(100.0).build();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());


        assertThrows(UserNotFoundException.class, () -> adviceService.generateAdvice(questionnaire));
        verify(userRepository, times(1)).findById(userId);
        verifyNoInteractions(fixedExpenseRepository);
        verifyNoInteractions(variableExpenseRepository);
        verifyNoInteractions(goalRepository);
        verifyNoInteractions(aiService);
        verifyNoInteractions(adviceRepository);
        verifyNoInteractions(adviceMapper);
    }

    @Test
    void getAdviceHistory_nullUserId_shouldThrowIllegalArgumentException() {

        assertThrows(IllegalArgumentException.class, () -> adviceService.getAdviceHistory(null));
        verifyNoInteractions(userRepository);
        verifyNoInteractions(adviceRepository);
        verifyNoInteractions(adviceMapper);
    }

    @Test
    void getAdviceHistory_userNotFound_shouldThrowUserNotFoundException() {

        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> adviceService.getAdviceHistory(userId));
        verify(userRepository, times(1)).findById(userId);
        verifyNoInteractions(adviceRepository);
        verifyNoInteractions(adviceMapper);
    }
}