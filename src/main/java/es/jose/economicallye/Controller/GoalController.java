package es.jose.economicallye.Controller;

import es.jose.economicallye.Dto.GoalDTO;
import es.jose.economicallye.Service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalDTO createGoal(@Valid @RequestBody GoalDTO goalDTO) {
        return goalService.createGoal(goalDTO);
    }

    @GetMapping("/{userId}")
    public List<GoalDTO> getGoalsByUserId(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @PutMapping("/{id}")
    public GoalDTO updateGoal(@PathVariable Long id,@Valid @RequestBody GoalDTO goalDTO) {
        return goalService.updateGoal(id, goalDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}
