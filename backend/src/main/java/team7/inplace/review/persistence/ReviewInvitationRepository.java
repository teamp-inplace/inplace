package team7.inplace.review.persistence;

import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import team7.inplace.global.redis.RedisRepository;
import team7.inplace.review.domain.ReviewInvitation;

@Repository
@RequiredArgsConstructor
public class ReviewInvitationRepository implements RedisRepository<ReviewInvitation> {
    private final RedisTemplate<String, Object> redisTemplate;

    private final Long DEFAULT_TIMEOUT = 3 * 24 * 60 * 60L; // 3일
    private final TimeUnit timeoutUnit = TimeUnit.SECONDS;

    private final String UUID_PREFIX = "review:uuid:";
    private final String USER_ID_PREFIX = "review:userId:";
    private final String PLACE_ID_PREFIX = "review:placeId:";

    @Override
    public void save(String key, ReviewInvitation value) {
        this.save(key, value, DEFAULT_TIMEOUT);
    }

    @Override
    public void save(String key, ReviewInvitation value, long timeout) {
        redisTemplate.opsForValue().set(UUID_PREFIX + key, value, timeout, timeoutUnit);

        // userId, placeId로도 조회할 수 있도록 UUID 저장
        redisTemplate.opsForSet().add(USER_ID_PREFIX + value.getUserId(), key, timeout, timeoutUnit);
        redisTemplate.opsForSet().add(PLACE_ID_PREFIX + value.getPlaceId(), key, timeout, timeoutUnit);
    }

    @Override
    public Optional<ReviewInvitation> get(String key) {
        var value = redisTemplate.opsForValue().get(UUID_PREFIX + key);
        return Optional.ofNullable((ReviewInvitation) value);
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(UUID_PREFIX + key);
    }

    public Optional<String> findUUIDByUserIdAndPlaceId(Long userId, Long placeId) {
        var uuids = redisTemplate.opsForSet()
                .intersect(USER_ID_PREFIX + userId, PLACE_ID_PREFIX + placeId);
        if (uuids == null || uuids.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of((String) uuids.iterator().next());
    }
}
