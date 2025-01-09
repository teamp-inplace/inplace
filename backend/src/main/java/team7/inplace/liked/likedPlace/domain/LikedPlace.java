package team7.inplace.liked.likedPlace.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import team7.inplace.global.baseEntity.BaseEntity;

@Getter
@Entity
@Table(name = "liked_places")
@NoArgsConstructor(access = PROTECTED)
public class LikedPlace extends BaseEntity {
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long placeId;

    @Column(nullable = false)
    private Boolean isLiked;

    private LikedPlace(Long userId, Long placeId) {
        this.userId = userId;
        this.placeId = placeId;
        this.isLiked = false;
    }

    public static LikedPlace from(Long userId, Long placeId) {
        return new LikedPlace(userId, placeId);
    }

    public void updateLike(boolean like) {
        this.isLiked = like;
    }
}
