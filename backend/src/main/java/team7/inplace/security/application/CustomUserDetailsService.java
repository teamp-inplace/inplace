package team7.inplace.security.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import team7.inplace.security.application.dto.CustomUserDetails;
import team7.inplace.user.application.UserService;
import team7.inplace.user.application.dto.UserCommand;

@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserCommand.AdminUserInfo adminUserInfo = userService.findAdminUserByUsername(username)
            .orElseThrow(()-> new UsernameNotFoundException("User is not found"));

        return CustomUserDetails.makeUser(adminUserInfo);
    }
}
