package team7.inplace.token.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;

@Getter
@ToString
@Slf4j
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {
    private String username;

    private String refreshToken;

    public void checkValidToken(String refreshToken) {
        if (this.refreshToken.equals(refreshToken)) {
            return;
        }
        throw InplaceException.of(AuthorizationErrorCode.INVALID_TOKEN);
    }
}
