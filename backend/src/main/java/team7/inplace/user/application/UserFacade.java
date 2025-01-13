package team7.inplace.user.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import team7.inplace.global.annotation.Facade;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.influencer.application.InfluencerService;
import team7.inplace.influencer.application.dto.InfluencerInfo;
import team7.inplace.place.application.PlaceService;
import team7.inplace.place.application.dto.LikedPlaceInfo;
import team7.inplace.review.application.ReviewService;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.security.util.AuthorizationUtil;

@Facade
@RequiredArgsConstructor
public class UserFacade {
    private final InfluencerService influencerService;
    private final PlaceService placeService;
    private final ReviewService reviewService;

    //TODO: Return 클래스 변경 필요
    public Page<InfluencerInfo> getMyFavoriteInfluencers(Pageable pageable) {
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }
        Long userId = AuthorizationUtil.getUserId();
        return influencerService.getFavoriteInfluencers(userId, pageable);
    }

    //TODO: Return 클래스 변경 필요
    public Page<LikedPlaceInfo> getMyFavoritePlaces(Pageable pageable) {
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }
        Long userId = AuthorizationUtil.getUserId();
        return placeService.getLikedPlaceInfo(userId, pageable);
    }

    public Page<ReviewQueryResult.Detail> getMyReviews(Pageable pageable) {
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }
        Long userId = AuthorizationUtil.getUserId();
        return reviewService.getUserReviews(userId, pageable);
    }
}
