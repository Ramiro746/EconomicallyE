    package es.jose.economicallye.Controller;

    import es.jose.economicallye.Dto.FixedExpenseDTO;
    import es.jose.economicallye.Service.FixedExpenseService;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/fixed-expenses")
    @RequiredArgsConstructor
    public class FixedExpenseController {

        private final FixedExpenseService fixedExpenseService;

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public FixedExpenseDTO createFixedExpense(@Valid @RequestBody FixedExpenseDTO fixedExpenseDTO) {
            return fixedExpenseService.createFixedExpense(fixedExpenseDTO);
        }

        @GetMapping("/{userId}")
        public List<FixedExpenseDTO> getFixedExpensesByUserId(@PathVariable Long userId) {
            return fixedExpenseService.getFixedExpensesByUserId(userId);
        }

        @PutMapping("/{id}")
        public FixedExpenseDTO updateFixedExpense(@PathVariable Long id,@Valid @RequestBody FixedExpenseDTO fixedExpenseDTO) {
            return fixedExpenseService.updateFixedExpense(id, fixedExpenseDTO);
        }

        @DeleteMapping("/{id}")
        public void deleteFixedExpense(@PathVariable Long id) {
            fixedExpenseService.deleteFixedExpense(id);
        }
    }
