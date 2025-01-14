package team7.inplace.kakao.application.command;

import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.video.application.AliasUtil;
import team7.inplace.video.persistence.dto.VideoQueryResult;

public record PlaceMessageCommand(
        Long placeId,
        String title,
        String address,
        String imageUrl,
        String description
) {

    public static PlaceMessageCommand from(PlaceQueryResult.SimplePlace place, VideoQueryResult.SimpleVideo video) {
        String influencerName = video.influencerName();
        String videoUUID = video.videoUUID();
        return new PlaceMessageCommand(
                place.placeId(),
                place.placeName(),
                place.address1() + " " + place.address2() + " " + place.address3(),
                String.format("https://img.youtube.com/vi/%s/maxresdefault.jpg", videoUUID),
                AliasUtil.makeAlias(
                        influencerName,
                        video.placeCategory()
                )
        );
    }
}
