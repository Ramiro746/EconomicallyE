package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.VariableExpenseDTO;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Entity.VariableExpense;
import es.jose.economicallye.Mapper.VariableExpenseMapper;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Repository.VariableExpenseRepository;
import es.jose.economicallye.Service.VariableExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VariableExpenseServiceImpl implements VariableExpenseService {

    private final VariableExpenseRepository variableExpenseRepository;
    private final UserRepository userRepository;
    private final VariableExpenseMapper variableExpenseMapper;

    @Override
    public VariableExpenseDTO createVariableExpense(VariableExpenseDTO variableExpenseDTO) {
        User user = userRepository.findById(variableExpenseDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        VariableExpense variableExpense = variableExpenseMapper.toEntity(variableExpenseDTO);
        variableExpense.setUser(user);
        variableExpense = variableExpenseRepository.save(variableExpense);
        return variableExpenseMapper.toDto(variableExpense);
    }

    @Override
    public List<VariableExpenseDTO> getVariableExpensesByUserId(Long userId) {
        return variableExpenseRepository.findByUserId(userId).stream()
                .map(variableExpenseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VariableExpenseDTO updateVariableExpense(Long id, VariableExpenseDTO variableExpenseDTO) {
        VariableExpense variableExpense = variableExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variable expense not found"));

        variableExpense.setName(variableExpenseDTO.getName());
        variableExpense.setAmount(variableExpenseDTO.getAmount());
        variableExpense.setExpenseDate(variableExpenseDTO.getExpenseDate());
        variableExpense.setDescription(variableExpenseDTO.getDescription());

        variableExpense = variableExpenseRepository.save(variableExpense);
        return variableExpenseMapper.toDto(variableExpense);
    }

    @Override
    public void deleteVariableExpense(Long id) {
        variableExpenseRepository.deleteById(id);
    }
}
