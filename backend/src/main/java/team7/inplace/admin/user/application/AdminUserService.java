package team7.inplace.admin.user.application;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.admin.user.application.dto.AdminUserInfo;
import team7.inplace.admin.user.persistence.AdminUserRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final AdminUserRepository adminUserRepository;

    @Transactional(readOnly = true)
    public Optional<AdminUserInfo> findAdminUserByUsername(String username) {
        return adminUserRepository.findByUsername(username)
            .map(AdminUserInfo::of);
    }
}
