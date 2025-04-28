package es.jose.economicallye.Controller;


import es.jose.economicallye.Dto.UserOverviewDTO;
import es.jose.economicallye.Service.Implementations.UserOverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/overview")
@RequiredArgsConstructor
public class UserOverviewController {

    private final UserOverviewService overviewService;

    @GetMapping("/{userId}")
    public UserOverviewDTO getUserOverview(@PathVariable Long userId) {
        return overviewService.getUserOverview(userId);
    }
}
