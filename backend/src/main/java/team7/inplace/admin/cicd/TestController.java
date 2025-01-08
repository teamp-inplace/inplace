package team7.inplace.admin.cicd;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/cicd")
    public ResponseEntity test() {
        return ResponseEntity.ok("레포 옮김 ci/cd 테스트2");
    }
}
