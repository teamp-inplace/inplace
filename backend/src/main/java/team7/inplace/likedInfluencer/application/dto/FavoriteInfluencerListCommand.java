package team7.inplace.likedInfluencer.application.dto;

import java.util.List;

public record FavoriteInfluencerListCommand(
        List<Long> influencerIds,
        Boolean likes
) {

}
