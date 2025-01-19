package team7.inplace.user.application;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.UserErrorCode;
import team7.inplace.security.application.CurrentUserProvider;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.user.application.dto.UserCommand;
import team7.inplace.user.application.dto.UserCommand.AdminUserInfo;
import team7.inplace.user.application.dto.UserCommand.Info;
import team7.inplace.user.application.dto.UserInfo;
import team7.inplace.user.domain.User;
import team7.inplace.user.persistence.AdminUserRepository;
import team7.inplace.user.persistence.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AdminUserRepository adminUserRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public UserCommand.Info registerUser(UserCommand.Create userCreate) {
        User user = userCreate.toEntity();
        userRepository.save(user);
        return UserCommand.Info.of(user);
    }

    @Transactional(readOnly = true)
    public UserCommand.Info getUserByUsername(String username) {
        return UserCommand.Info.of(userRepository.findByUsername(username)
            .orElseThrow(() -> InplaceException.of(UserErrorCode.NOT_FOUND)));
    }

    @Transactional
    public Optional<Info> findUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(Info::of);
    }

    @Transactional
    public void updateNickname(String nickname) {
        User user = userRepository.findByUsername(AuthorizationUtil.getUsername()).orElseThrow(
            () -> InplaceException.of(UserErrorCode.NOT_FOUND)
        );

        user.updateInfo(nickname);
    }

    @Transactional(readOnly = true)
    public UserInfo getUserInfo() {
        User user = currentUserProvider.getCurrentUser();
        return UserInfo.from(user);
    }

    @Transactional
    public Optional<UserCommand.AdminUserInfo> findAdminUserByUsername(String username) {
        return adminUserRepository.findByUsername(username)
            .map(AdminUserInfo::of);
    }

}
