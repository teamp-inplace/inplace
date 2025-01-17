package team7.inplace.token.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.security.util.JwtUtil;
import team7.inplace.token.domain.RefreshToken;
import team7.inplace.token.persistence.RefreshTokenRepository;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefreshTokenService {
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public void checkInvalidToken(String refreshToken) throws InplaceException {
        String username = jwtUtil.getUsername(refreshToken);
        refreshTokenRepository.get(username)
                .ifPresentOrElse(
                        token -> token.checkValidToken(refreshToken),
                        () -> {
                            log.error("username: {}", username);
                            log.error("Not found refresh token");
                            throw InplaceException.of(AuthorizationErrorCode.INVALID_TOKEN);
                        }
                );
//        refreshTokenRepository.get(username)
//                .orElseThrow(() -> InplaceException.of(AuthorizationErrorCode.INVALID_TOKEN))
//                .checkValidToken(refreshToken);
    }

    public void saveRefreshToken(String username, String token) {
        RefreshToken refreshToken = new RefreshToken(username, token);
        refreshTokenRepository.save(username, refreshToken, jwtUtil.getRefreshTokenExpiredTime());
        log.info("Refresh token saved: {}", refreshToken);
        log.info("Refresh token saved: {}", refreshTokenRepository.get(username));
    }

    public void deleteRefreshToken(String username) {
        refreshTokenRepository.delete(username);
    }
}
