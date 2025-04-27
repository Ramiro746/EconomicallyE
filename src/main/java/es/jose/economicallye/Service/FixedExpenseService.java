package es.jose.economicallye.Service;

import es.jose.economicallye.Dto.FixedExpenseDTO;

import java.util.List;

public interface FixedExpenseService {
    FixedExpenseDTO createFixedExpense(FixedExpenseDTO fixedExpenseDTO);
    List<FixedExpenseDTO> getFixedExpensesByUserId(Long userId);
    FixedExpenseDTO updateFixedExpense(Long id, FixedExpenseDTO fixedExpenseDTO);
    void deleteFixedExpense(Long id);
}
