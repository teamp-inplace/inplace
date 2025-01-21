package team7.inplace.admin.user.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.admin.user.application.AdminUserService;
import team7.inplace.admin.user.presentation.dto.LoginRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminLoginController {

    private final AuthenticationManager authenticationManager;
    private final AdminUserService adminUserService;

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.username(),
            loginRequest.password());
        Authentication authenticationResponse = authenticationManager.authenticate(authenticationRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody LoginRequest loginRequest) {
        adminUserService.registerAdminUser(LoginRequest.toRegisterCommand(loginRequest));
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
