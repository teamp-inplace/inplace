package team7.inplace.influencer.application.dto;

import team7.inplace.influencer.domain.Influencer;

public record InfluencerCommand(
        String influencerName,
        String influencerImgUrl,
        String influencerJob,
        String channelTitle,
        String channelId
) {

    public Influencer toEntity() {
        return new Influencer(
                influencerName(),
                influencerImgUrl(),
                influencerJob(),
                channelTitle(),
                channelId()
        );
    }
}
