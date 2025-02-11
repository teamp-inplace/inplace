package team7.inplace.place.application.dto;

import team7.inplace.place.persistence.dto.PlaceQueryResult;

public record LikedPlaceInfo(
    Long placeId,
    String placeName,
    String imageUrl,
    String influencerName,
    String address1,
    String address2,
    String address3,
    boolean likes
) {

    //TODO: Influencer 이름이 왜필요한가요?
    public static LikedPlaceInfo of(PlaceQueryResult.DetailedPlaceBulk placeBulk) {
        return new LikedPlaceInfo(
            placeBulk.detailedPlace().placeId(),
            placeBulk.detailedPlace().placeName(),
            placeBulk.detailedPlace().menuImgUrl(),
            "",
            placeBulk.detailedPlace().address1(),
            placeBulk.detailedPlace().address2(),
            placeBulk.detailedPlace().address3(),
            placeBulk.detailedPlace().isLiked()
        );
    }
}
