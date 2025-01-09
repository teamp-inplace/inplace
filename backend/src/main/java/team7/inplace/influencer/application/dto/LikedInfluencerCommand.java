package team7.inplace.influencer.application.dto;

import java.util.List;
import team7.inplace.liked.likedInfluencer.domain.LikedInfluencer;

public class LikedInfluencerCommand {
    public record Single(
            Long influencerId,
            Boolean like
    ) {
        public LikedInfluencer toEntity(Long userId) {
            return new LikedInfluencer(userId, influencerId, like);
        }
    }

    public record Multiple(
            List<Single> likes
    ) {
    }
}
