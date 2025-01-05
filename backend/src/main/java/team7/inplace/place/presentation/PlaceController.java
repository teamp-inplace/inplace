package team7.inplace.place.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team7.inplace.place.application.CategoryService;
import team7.inplace.place.application.PlaceMessageFacade;
import team7.inplace.place.application.PlaceService;
import team7.inplace.place.application.command.PlaceLikeCommand;
import team7.inplace.place.application.command.PlacesCommand.PlacesCoordinateCommand;
import team7.inplace.place.application.command.PlacesCommand.PlacesFilterParamsCommand;
import team7.inplace.place.application.dto.CategoryInfo;
import team7.inplace.place.application.dto.PlaceInfo;
import team7.inplace.place.presentation.dto.*;
import team7.inplace.review.application.ReviewService;
import team7.inplace.review.application.dto.ReviewCommand;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class PlaceController implements PlaceControllerApiSpec {

    private final PlaceService placeService;
    private final CategoryService categoryService;
    private final ReviewService reviewService;
    private final PlaceMessageFacade placeMessageFacade;

    @GetMapping
    public ResponseEntity<PlacesResponse> getPlaces(
            @RequestParam String longitude,
            @RequestParam String latitude,
            @RequestParam String topLeftLongitude,
            @RequestParam String topLeftLatitude,
            @RequestParam String bottomRightLongitude,
            @RequestParam String bottomRightLatitude,
            @RequestParam(required = false) String categories,
            @RequestParam(required = false) String influencers,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        // 위치기반 조회
        Page<PlaceInfo> placeInfos = placeService.getPlacesWithinRadius(
                new PlacesCoordinateCommand(
                        topLeftLongitude,
                        topLeftLatitude,
                        bottomRightLongitude,
                        bottomRightLatitude,
                        longitude,
                        latitude,
                        pageable
                ),
                new PlacesFilterParamsCommand(
                        categories,
                        influencers
                )
        );
        return new ResponseEntity<>(PlacesResponse.of(placeInfos), HttpStatus.OK);
    }

    @GetMapping("/categories")
    public ResponseEntity<CategoriesResponse> getCategories() {
        List<CategoryInfo> categories = categoryService.getCategories();
        CategoriesResponse response = new CategoriesResponse(categories);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailResponse> getPlaceDetail(
            @PathVariable("id") Long placeId
    ) {
        PlaceDetailResponse response = PlaceDetailResponse.from(
                placeService.getPlaceDetailInfo(placeId));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/likes")
    public ResponseEntity<Void> likeToPlace(@RequestBody PlaceLikeRequest param) {
        placeService.likeToPlace(new PlaceLikeCommand(param.placeId(), param.likes()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Void> createReview(@PathVariable("id") Long placeId,
                                             @RequestBody ReviewRequest request) {
        ReviewCommand reviewCommand = request.toCommand();

        reviewService.createReview(placeId, reviewCommand);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @PathVariable("id") Long placeId,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<ReviewResponse> reviews = reviewService.getReviews(placeId, pageable)
                .map(ReviewResponse::from);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/place-message/{place-id}")
    public ResponseEntity<Void> sendPlaceMessage(@PathVariable("place-id") Long placeId) {
        placeMessageFacade.sendPlaceMessage(placeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
