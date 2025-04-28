package es.jose.economicallye.Service;

import es.jose.economicallye.Dto.FinancialQuestionnaireDTO;

public interface FinancialService {
    FinancialQuestionnaireDTO getFinancialDataByUserId(Long userId);
}