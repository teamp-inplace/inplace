package team7.inplace.place.presentation.dto;

import team7.inplace.place.application.command.PlacesCommand;

public class PlaceRequest {

    public record Like(
        Long placeId,
        Boolean likes
    ) {

    }

    public record Create(
        Long videoId,
        String placeName,
        String category,
        String address,
        String x,
        String y,
        Long kakaoPlaceId,
        String googlePlaceId
    ) {

        public PlacesCommand.Create toCommand() {
            return new PlacesCommand.Create(
                placeName, category, address, x, y, googlePlaceId, kakaoPlaceId
            );
        }
    }
}
