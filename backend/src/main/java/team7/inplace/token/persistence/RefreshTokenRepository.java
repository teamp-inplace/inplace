package team7.inplace.token.persistence;

import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import team7.inplace.global.redis.RedisRepository;
import team7.inplace.token.domain.RefreshToken;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository implements RedisRepository<RefreshToken> {
    private final RedisTemplate<String, Object> redisTemplate;

    private final String REFRESH_TOKEN_PREFIX = "refresh:";
    private final TimeUnit timeoutUnit = TimeUnit.MICROSECONDS;

    @Override
    public void save(String key, RefreshToken value) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + key, value);
    }

    @Override
    public void save(String key, RefreshToken value, long timeout) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + key, value, timeout, timeoutUnit);
    }

    @Override
    public Optional<RefreshToken> get(String key) {
        var value = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + key);
        return Optional.ofNullable((RefreshToken) value);
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + key);
    }
}
