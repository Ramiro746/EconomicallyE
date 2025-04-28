package es.jose.economicallye.Service;

import es.jose.economicallye.Dto.VariableExpenseDTO;

import java.util.List;

public interface VariableExpenseService {
    VariableExpenseDTO createVariableExpense(VariableExpenseDTO variableExpenseDTO);
    List<VariableExpenseDTO> getVariableExpensesByUserId(Long userId);
    VariableExpenseDTO updateVariableExpense(Long id, VariableExpenseDTO variableExpenseDTO);
    void deleteVariableExpense(Long id);
}
