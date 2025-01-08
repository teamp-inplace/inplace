package team7.inplace.place.application.dto;


import team7.inplace.liked.likedPlace.domain.LikedPlace;

public record LikedPlaceInfo(
        Long placeId,
        String placeName,
        String imageUrl,
        String influencerName,
        boolean likes
) {
    //TODO: Influencer 이름이 왜필요한가요?
    public static LikedPlaceInfo of(PlaceQueryResult.DetailedPlaceBulk placeBulk) {
        return new LikedPlaceInfo(
                placeBulk.detailedPlace().placeId(),
                placeBulk.detailedPlace().placeName(),
                placeBulk.detailedPlace().menuImgUrl(),
                "",
                placeBulk.detailedPlace().isLiked()
        );
    }
}
