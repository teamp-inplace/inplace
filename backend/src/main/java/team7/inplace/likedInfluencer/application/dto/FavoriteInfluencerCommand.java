package team7.inplace.likedInfluencer.application.dto;

public record FavoriteInfluencerCommand(
        Long influencerId,
        Boolean likes
) {

}
