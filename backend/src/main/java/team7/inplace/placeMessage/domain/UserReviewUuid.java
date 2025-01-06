package team7.inplace.placeMessage.domain;

import static lombok.AccessLevel.PROTECTED;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@RedisHash(value = "UserReviewUuid", timeToLive = 3 * 24 * 60 * 60) // 3일
public class UserReviewUuid {

    @Id
    private String uuid;
    @Indexed
    private Long userId;
    @Indexed
    private Long placeId;
}
