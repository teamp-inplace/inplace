package team7.inplace.security.application.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import team7.inplace.user.application.dto.UserCommand;
import team7.inplace.user.domain.AdminUser;

public record CustomUserDetails(
    String username,
    String password,
    String roles,
    Collection<GrantedAuthority> authorities
) implements UserDetails {

    public CustomUserDetails(String username, String password, String roles) {
        this(username, password, roles, createAuthorities(roles));
    }

    private static Collection<GrantedAuthority> createAuthorities(String roles) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        for (String role : roles.split(",")) {
            if (!StringUtils.hasText(role)) continue;
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public static CustomUserDetails makeUser(UserCommand.AdminUserInfo adminUserInfo) {
        return new CustomUserDetails(adminUserInfo.username(), adminUserInfo.password(), adminUserInfo.role().getRoles());
    }
}
