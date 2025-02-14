package team7.inplace.place.presentation.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import team7.inplace.place.application.dto.PlaceInfo;
import team7.inplace.place.client.GooglePlaceClientResponse;
import team7.inplace.place.client.GooglePlaceClientResponse.AccessibilityOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.ParkingOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.PaymentOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.RegularOpeningHours;
import team7.inplace.place.domain.Category;
import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult.SimpleVideo;

public class PlacesResponse {

    public record Simple(
        Long placeId,
        String placeName,
        Address address,
        String category,
        String influencerName,
        String menuImgUrl,
        String longitude,
        String latitude,
        Boolean likes
    ) {

        public static List<Simple> from(List<PlaceInfo.Simple> placeInfos) {
            return placeInfos.stream()
                .map(Simple::from)
                .toList();
        }

        public static Simple from(PlaceInfo.Simple placeInfo) {
            return new Simple(
                placeInfo.place().placeId(),
                placeInfo.place().placeName(),
                new Address(
                    placeInfo.place().address1(),
                    placeInfo.place().address2(),
                    placeInfo.place().address3()
                ),
                placeInfo.place().category().getName(),
                placeInfo.video().stream().map(SimpleVideo::influencerName)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.joining(", ")),
                "",
                placeInfo.place().longitude().toString(),
                placeInfo.place().latitude().toString(),
                placeInfo.place().isLiked()
            );
        }
    }

    public record Detail(
        Long placeId,
        String placeName,
        PlacesResponse.Address address,
        String category,
        Double longitude,
        Double latitude,
        PlacesResponse.Facility facility,
        List<PlacesResponse.Video> videos,
        List<PlacesResponse.GoogleReview> googleReviews,
        Double rating,
        String kakaoPlaceUrl,
        String googlePlaceUrl,
        List<String> openingHours,
        PlacesResponse.PlaceLike placeLikes
    ) {

        public static PlacesResponse.Detail from(PlaceInfo.Detail place) {
            return new PlacesResponse.Detail(
                place.place().placeId(),
                place.place().placeName(),
                new PlacesResponse.Address(
                    place.place().address1(),
                    place.place().address2(),
                    place.place().address3()
                ),
                place.place().category().getName(),
                place.place().longitude(),
                place.place().latitude(),
                PlacesResponse.Facility.of(
                    place.googlePlace().accessibilityOptions().orElse(null),
                    place.googlePlace().parkingOptions().orElse(null),
                    place.googlePlace().paymentOptions().orElse(null)
                ),
                place.videos().stream()
                    .map(PlacesResponse.Video::from)
                    .toList(),
                place.googlePlace().reviews()
                    .stream()
                    .map(PlacesResponse.GoogleReview::from)
                    .toList(),
                place.googlePlace().rating(),
                "http://place.map.kakao.com/" + place.place().kakaoPlaceId(),
                place.googlePlace().googleMapsUri(),
                place.googlePlace().regularOpeningHours()
                    .map(RegularOpeningHours::weekdayDescriptions)
                    .orElse(List.of()),
                PlacesResponse.PlaceLike.from(place.reviewLikeRate())
            );
        }
    }

    public record Address(
        String address1,
        String address2,
        String address3
    ) {

    }

    @JsonInclude(Include.NON_NULL)
    public record Facility(
        Boolean wheelchairAccessibleSeating,
        Boolean freeParkingLot,
        Boolean paidParkingLot,
        Boolean acceptsCreditCards,
        Boolean acceptsCashOnly
    ) {

        public static PlacesResponse.Facility of(
            GooglePlaceClientResponse.AccessibilityOptions accessibilityOptions,
            GooglePlaceClientResponse.ParkingOptions parkingOptions,
            GooglePlaceClientResponse.PaymentOptions paymentOptions
        ) {
            return new PlacesResponse.Facility(
                Optional.ofNullable(accessibilityOptions)
                    .flatMap(AccessibilityOptions::wheelchairAccessibleSeating)
                    .orElse(null),
                Optional.ofNullable(parkingOptions)
                    .flatMap(ParkingOptions::freeParkingLot)
                    .orElse(null),
                Optional.ofNullable(parkingOptions)
                    .flatMap(ParkingOptions::paidParkingLot)
                    .orElse(null),
                Optional.ofNullable(paymentOptions)
                    .flatMap(PaymentOptions::acceptsCreditCards)
                    .orElse(null),
                Optional.ofNullable(paymentOptions)
                    .flatMap(PaymentOptions::acceptsCashOnly)
                    .orElse(null)
            );
        }
    }

    public record GoogleReview(
        Boolean like,
        String text,
        String name,
        String publishTime
    ) {

        public static PlacesResponse.GoogleReview from(GooglePlaceClientResponse.Review review) {
            return new PlacesResponse.GoogleReview(
                review.rating() >= 3,
                review.text().isEmpty() ? "" : review.text().get().text().orElse(""),
                review.authorAttribution().displayName(),
                review.publishTime().toString()
            );
        }
    }

    public record Review(
        Long reviewId,
        boolean likes,
        String comment,
        String userNickname,
        LocalDate createdDate,
        boolean mine
    ) {

    }

    public record PlaceLike(
        Long like,
        Long dislike
    ) {

        public static PlacesResponse.PlaceLike from(ReviewQueryResult.LikeRate placeLike) {
            return new PlacesResponse.PlaceLike(placeLike.likes(), placeLike.dislikes());
        }
    }

    public record Video(
        String videoUrl,
        String influencerName
    ) {

        public static PlacesResponse.Video from(VideoQueryResult.SimpleVideo video) {
            return new PlacesResponse.Video(video.videoUrl(), video.influencerName());
        }
    }

    public record Location(
        Long placeId,
        Double longitude,
        Double latitude
    ) {

        public static List<Location> from(List<PlaceQueryResult.Location> locations) {
            return locations.stream()
                .map(PlacesResponse.Location::from)
                .toList();
        }

        private static Location from(PlaceQueryResult.Location location) {
            return new Location(
                location.placeId(),
                location.longitude(),
                location.latitude()
            );
        }
    }

    public record Marker(
        Long placeId,
        String placeName,
        String category,
        String influencerName,
        Address address,
        String menuImgUrl
    ) {

        public static Marker from(PlaceInfo.Marker marker) {
            return new Marker(
                marker.place().placeId(),
                marker.place().placeName(),
                Category.valueOf(marker.place().category()).getName(),
                marker.influencerNames(),
                new Address(
                    marker.place().address1(),
                    marker.place().address2(),
                    marker.place().address3()
                ),
                ""
            );
        }
    }
}
