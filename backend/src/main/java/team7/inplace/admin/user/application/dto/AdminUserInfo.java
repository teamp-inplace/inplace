package team7.inplace.admin.user.application.dto;

import team7.inplace.admin.user.domain.AdminUser;
import team7.inplace.user.domain.Role;

public record AdminUserInfo(
    Long id,
    String username,
    String password,
    Role role
) {
    public static AdminUserInfo of(AdminUser adminUser) {
        return new AdminUserInfo(adminUser.getId(), adminUser.getUsername(), adminUser.getPassword(), adminUser.getRole());
    }
}
