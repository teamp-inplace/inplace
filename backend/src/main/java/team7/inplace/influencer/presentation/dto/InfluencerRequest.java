package team7.inplace.influencer.presentation.dto;

import java.util.List;
import team7.inplace.influencer.application.dto.InfluencerCommand;
import team7.inplace.influencer.application.dto.LikedInfluencerCommand;

public class InfluencerRequest {

    public record Upsert(
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

    public record Like(
        Long influencerId,
        Boolean likes
    ) {

        public LikedInfluencerCommand.Single toCommand() {
            return new LikedInfluencerCommand.Single(influencerId(), likes());
        }
    }

    public record Likes(
        List<Long> influencerIds,
        Boolean likes
    ) {

        public LikedInfluencerCommand.Multiple toCommand() {
            var command = influencerIds.stream()
                .map(influencerId -> new LikedInfluencerCommand.Single(influencerId, likes))
                .toList();

            return new LikedInfluencerCommand.Multiple(command);
        }
    }
}
