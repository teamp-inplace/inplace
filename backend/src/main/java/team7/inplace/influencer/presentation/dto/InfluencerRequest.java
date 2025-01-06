package team7.inplace.influencer.presentation.dto;

import team7.inplace.influencer.application.dto.InfluencerCommand;

public record InfluencerRequest(
        String influencerName,
        String influencerImgUrl,
        String influencerJob,
        String channelTitle,
        String channelId
) {

    public InfluencerCommand toCommand() {
        return new InfluencerCommand(
                influencerName(),
                influencerImgUrl(),
                influencerJob(),
                channelTitle(),
                channelId()
        );
    }
}
