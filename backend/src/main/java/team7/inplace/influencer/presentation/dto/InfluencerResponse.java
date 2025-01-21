package team7.inplace.influencer.presentation.dto;

import team7.inplace.influencer.application.dto.InfluencerInfo;
import team7.inplace.influencer.application.dto.InfluencerNameInfo;
import team7.inplace.influencer.persistence.dto.InfluencerQueryResult;

public class InfluencerResponse {

    //TODO: 클래스 이름 변경해야함
    public record Info(
        Long influencerId,
        String influencerName,
        String influencerImgUrl,
        String influencerJob,
        boolean likes
    ) {

        public static InfluencerResponse.Info from(InfluencerInfo influencerInfo) {
            return new InfluencerResponse.Info(
                influencerInfo.influencerId(),
                influencerInfo.influencerName(),
                influencerInfo.influencerImgUrl(),
                influencerInfo.influencerJob(),
                influencerInfo.likes()
            );
        }

        public static InfluencerResponse.Info from(InfluencerQueryResult.Simple influencerInfo) {
            return new InfluencerResponse.Info(
                influencerInfo.id(),
                influencerInfo.name(),
                influencerInfo.imgUrl(),
                influencerInfo.job(),
                influencerInfo.isLiked()
            );
        }
    }

    public record Name(
        String influencerName
    ) {

        public static Name from(InfluencerNameInfo influencerInfo) {
            return new Name(influencerInfo.name());
        }
    }

    public record Detail(
        Long influencerId,
        String influencerName,
        String influencerImgUrl,
        String influencerJob,
        Boolean likes,
        Long follower,
        Long placeCount
    ) {

        public static Detail from(InfluencerQueryResult.Detail influencerInfo) {
            return new Detail(
                influencerInfo.id(),
                influencerInfo.name(),
                influencerInfo.imgUrl(),
                influencerInfo.job(),
                influencerInfo.isLiked(),
                influencerInfo.follower(),
                influencerInfo.placeCount()
            );
        }
    }
}
