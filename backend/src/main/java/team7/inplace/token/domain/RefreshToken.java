package team7.inplace.token.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {
    private String username;

    private String refreshToken;

    public boolean isWrongRefreshToken(String refreshToken) {
        return !this.refreshToken.equals(refreshToken);
    }
}
