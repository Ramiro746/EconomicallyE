package es.jose.economicallye.Service.Implementations;

import es.jose.economicallye.Dto.FixedExpenseDTO;
import es.jose.economicallye.Entity.FixedExpense;
import es.jose.economicallye.Entity.User;
import es.jose.economicallye.Mapper.FixedExpenseMapper;
import es.jose.economicallye.Repository.FixedExpenseRepository;
import es.jose.economicallye.Repository.UserRepository;
import es.jose.economicallye.Service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FixedExpenseServiceImpl implements FixedExpenseService {
    private final FixedExpenseRepository fixedExpenseRepository;
    private final UserRepository userRepository;
    private final FixedExpenseMapper fixedExpenseMapper;

    @Override
    public FixedExpenseDTO createFixedExpense(FixedExpenseDTO fixedExpenseDTO) {
        User user = userRepository.findById(fixedExpenseDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FixedExpense fixedExpense = fixedExpenseMapper.toEntity(fixedExpenseDTO);
        fixedExpense.setUser(user);
        fixedExpense = fixedExpenseRepository.save(fixedExpense);
        return fixedExpenseMapper.toDto(fixedExpense);
    }

    @Override
    public List<FixedExpenseDTO> getFixedExpensesByUserId(Long userId) {
        return fixedExpenseRepository.findByUserId(userId).stream()
                .map(fixedExpenseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FixedExpenseDTO updateFixedExpense(Long id, FixedExpenseDTO fixedExpenseDTO) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fixed expense not found"));

        fixedExpense.setName(fixedExpenseDTO.getName());
        fixedExpense.setAmount(fixedExpenseDTO.getAmount());
        fixedExpense.setFrequency(fixedExpenseDTO.getFrequency());
        fixedExpense.setDescription(fixedExpenseDTO.getDescription());

        fixedExpense = fixedExpenseRepository.save(fixedExpense);
        return fixedExpenseMapper.toDto(fixedExpense);
    }

    @Override
    public void deleteFixedExpense(Long id) {
        fixedExpenseRepository.deleteById(id);
    }
}
