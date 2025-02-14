package team7.inplace.place.application.command;

import io.micrometer.common.util.StringUtils;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import team7.inplace.place.domain.Category;
import team7.inplace.place.domain.Place;
import team7.inplace.video.presentation.dto.VideoSearchParams;

@Slf4j
public class PlacesCommand {

    public record Coordinate(
        Double topLeftLongitude,
        Double topLeftLatitude,
        Double bottomRightLongitude,
        Double bottomRightLatitude,
        Double longitude,
        Double latitude
    ) {

        public static Coordinate from(
            VideoSearchParams videoSearchParams
        ) {
            return new Coordinate(
                Double.valueOf(videoSearchParams.topLeftLongitude()),
                Double.valueOf(videoSearchParams.topLeftLatitude()),
                Double.valueOf(videoSearchParams.bottomRightLatitude()),
                Double.valueOf(videoSearchParams.bottomRightLatitude()),
                Double.valueOf(videoSearchParams.longitude()),
                Double.valueOf(videoSearchParams.latitude()
                ));
        }
    }

    public record FilterParams(
        String categories,
        String influencers
    ) {

        public List<Category> getCategoryFilters() {
            if (categoryFilterNotExists()) {
                return null;
            }
            return Arrays.stream(categories.split(","))
                .map(Category::of)
                .toList();
        }

        public List<String> getInfluencerFilters() {
            if (influencerFilterNotExists()) {
                return null;
            }
            return Arrays.stream(influencers.split(",")).toList();
        }

        private boolean categoryFilterNotExists() {
            return !StringUtils.isNotEmpty(categories);
        }

        private boolean influencerFilterNotExists() {
            return !StringUtils.isNotEmpty(influencers);
        }
    }

    public record Create(
        String placeName,
        String category,
        String address,
        String x,
        String y,
        String googlePlaceId,
        Long kakaoPlaceId
    ) {

        public Place toEntity() {
            return new Place(
                placeName,
                category,
                address,
                x,
                y,
                googlePlaceId,
                kakaoPlaceId
            );
        }
    }
}
