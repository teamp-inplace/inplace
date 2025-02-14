package team7.inplace.token.application;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.UserErrorCode;
import team7.inplace.security.util.TokenEncryptionUtil;
import team7.inplace.token.application.command.OauthTokenCommand;
import team7.inplace.token.domain.OauthToken;
import team7.inplace.token.persistence.OauthTokenRepository;
import team7.inplace.user.domain.User;

@Service
@RequiredArgsConstructor
public class OauthTokenService {

    private final OauthTokenRepository oauthTokenRepository;
    private final EntityManager entityManager;
    private final TokenEncryptionUtil tokenEncryptionUtil;

    @Transactional(readOnly = true)
    public String findOAuthTokenByUserId(Long userId) {
        var token = oauthTokenRepository.findByUserId(userId)
            .orElseThrow(() -> InplaceException.of(UserErrorCode.OAUTH_TOKEN_NOT_FOUND));

        return tokenEncryptionUtil.decrypt(token.getOauthToken());
    }

    @Transactional
    public void insertOauthToken(OauthTokenCommand oauthTokenCommand) {
        User userProxy = entityManager.getReference(User.class, oauthTokenCommand.userId());
        OauthToken oauthToken = OauthToken.of(
            tokenEncryptionUtil.encrypt(oauthTokenCommand.oauthToken()),
            oauthTokenCommand.expiresAt(),
            userProxy
        );

        oauthTokenRepository.save(oauthToken);
    }

    @Transactional
    public void updateOauthToken(OauthTokenCommand oauthTokenCommand) {
        OauthToken oauthToken = oauthTokenRepository.findByUserId(oauthTokenCommand.userId())
            .orElseThrow(() -> InplaceException.of(UserErrorCode.OAUTH_TOKEN_NOT_FOUND));

        oauthToken.updateInfo(
            tokenEncryptionUtil.encrypt(oauthTokenCommand.oauthToken()),
            oauthTokenCommand.expiresAt()
        );
    }

}
