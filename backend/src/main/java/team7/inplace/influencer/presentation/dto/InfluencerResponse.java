package team7.inplace.influencer.presentation.dto;

import team7.inplace.influencer.application.dto.InfluencerInfo;
import team7.inplace.influencer.application.dto.InfluencerNameInfo;

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
    }

    public record Name(
            String influencerName
    ) {
        public static Name from(InfluencerNameInfo influencerInfo) {
            return new Name(influencerInfo.name());
        }
    }
}
