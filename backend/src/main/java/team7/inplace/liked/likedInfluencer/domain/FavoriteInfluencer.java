package team7.inplace.liked.likedInfluencer.domain;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class FavoriteInfluencer {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long influencerId;

    @Column(nullable = false)
    private boolean isLiked = false;

    public FavoriteInfluencer(Long userId, Long influencerId, boolean isLiked) {
        this.userId = userId;
        this.influencerId = influencerId;
        this.isLiked = isLiked;
    }

    public void updateLike(boolean like) {
        this.isLiked = like;
    }
}
