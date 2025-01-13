package team7.inplace.user.application.dto;

import team7.inplace.user.domain.User;

public record UserInfo(
        String nickname
) {

    public static UserInfo from(User user) {
        return new UserInfo(user.getNickname());
    }
}
