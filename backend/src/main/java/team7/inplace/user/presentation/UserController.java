package team7.inplace.user.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.user.application.UserFacade;
import team7.inplace.user.application.UserService;
import team7.inplace.user.presentation.dto.LikedInfluencerResponse;
import team7.inplace.user.presentation.dto.LikedPlaceResponse;
import team7.inplace.user.presentation.dto.MyReviewResponse;
import team7.inplace.user.presentation.dto.UserInfoResponse;

@RestController
@RequiredArgsConstructor
public class UserController implements UserControllerApiSepc {

    public final UserService userService;
    public final UserFacade userFacade;

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/user/nickname")
    public ResponseEntity<Void> updateNickname(
        @PathVariable("nickname") String nickname
    ) {
        userService.updateNickname(nickname);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/influencers")
    public ResponseEntity<Page<LikedInfluencerResponse>> getMyFavoriteInfluencers(
        @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<LikedInfluencerResponse> influencers = userFacade.getMyFavoriteInfluencers(pageable)
            .map(LikedInfluencerResponse::from);
        return new ResponseEntity<>(influencers, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/places")
    public ResponseEntity<Page<LikedPlaceResponse>> getMyFavoritePlaces(
        @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<LikedPlaceResponse> places = userFacade.getMyFavoritePlaces(pageable)
            .map(LikedPlaceResponse::from);
        return new ResponseEntity<>(places, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/reviews")
    public ResponseEntity<Page<MyReviewResponse>> getMyReviews(
        @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<MyReviewResponse> reviews = userFacade.getMyReviews(pageable)
            .map(MyReviewResponse::from);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/info")
    public ResponseEntity<UserInfoResponse> getUserInfo() {
        UserInfoResponse response = UserInfoResponse.from(userService.getUserInfo());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
