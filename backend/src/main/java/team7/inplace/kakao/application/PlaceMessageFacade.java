package team7.inplace.kakao.application;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import team7.inplace.global.annotation.Facade;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.UserErrorCode;
import team7.inplace.kakao.application.command.PlaceMessageCommand;
import team7.inplace.place.application.PlaceService;
import team7.inplace.review.application.ReviewInvitationService;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.token.application.OauthTokenService;

@Facade
@RequiredArgsConstructor
public class PlaceMessageFacade {

    private final OauthTokenService oauthTokenService;
    private final ScheduledExecutorService scheduledExecutorService;

    private final PlaceService placeService;
    private final ReviewInvitationService userReviewLinkService;
    private final KakaoMessageService kakaoMessageService;


    public void sendPlaceMessage(Long placeId) throws InplaceException {
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(UserErrorCode.NOT_FOUND);
        }

        String oauthToken = oauthTokenService.findOAuthTokenByUserId(AuthorizationUtil.getUserId());
        PlaceMessageCommand placeMessageCommand = placeService.getPlaceMessageCommand(placeId);
        kakaoMessageService.sendLocationMessageToMe(oauthToken, placeMessageCommand);

        String uuid = userReviewLinkService.generateReviewUuid(AuthorizationUtil.getUserId(),
            placeId);
        if (uuid == null) {
            return;
        }
        scheduledExecutorService.schedule(
            () -> kakaoMessageService.sendFeedMessageToMe(oauthToken, placeMessageCommand, uuid), 1,
            TimeUnit.MINUTES);
    }
}
