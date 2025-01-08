package team7.inplace.token.application.command;

public class TokenCommand {

    public record ReIssued(
            String accessToken,
            String refreshToken
    ) {

        public static ReIssued of(String reIssuedAccessToken, String reIssuedRefreshToken) {
            return new ReIssued(reIssuedAccessToken, reIssuedRefreshToken);
        }
    }
}
