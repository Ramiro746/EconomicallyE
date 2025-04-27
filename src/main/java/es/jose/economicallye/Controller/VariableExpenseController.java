package es.jose.economicallye.Controller;

import es.jose.economicallye.Dto.VariableExpenseDTO;
import es.jose.economicallye.Service.VariableExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variable-expenses")
@RequiredArgsConstructor
public class VariableExpenseController {

    private final VariableExpenseService variableExpenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VariableExpenseDTO createVariableExpense(@RequestBody VariableExpenseDTO variableExpenseDTO) {
        return variableExpenseService.createVariableExpense(variableExpenseDTO);
    }

    @GetMapping("/{userId}")
    public List<VariableExpenseDTO> getVariableExpensesByUserId(@PathVariable Long userId) {
        return variableExpenseService.getVariableExpensesByUserId(userId);
    }

    @PutMapping("/{id}")
    public VariableExpenseDTO updateVariableExpense(@PathVariable Long id, @RequestBody VariableExpenseDTO variableExpenseDTO) {
        return variableExpenseService.updateVariableExpense(id, variableExpenseDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteVariableExpense(@PathVariable Long id) {
        variableExpenseService.deleteVariableExpense(id);
    }
}
