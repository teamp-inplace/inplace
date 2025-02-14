package team7.inplace.kakao.persistence;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import team7.inplace.global.redis.RedisRepository;
import team7.inplace.kakao.domain.MessageSendHistory;

@Repository
@RequiredArgsConstructor
public class MessageSendHistoryRepository implements RedisRepository<MessageSendHistory> {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private final TimeUnit timeoutUnit = TimeUnit.SECONDS;
    private final String MESSAGE_SEND_HISTORY_PREFIX = "messageSendHistory:";

    @Override
    public void save(String key, MessageSendHistory value) {
        var now = LocalDateTime.now();
        var nextDayMidNight = now.plusDays(1).withHour(0).withMinute(0)
            .withSecond(0).withNano(0);
        Duration duration = Duration.between(now, nextDayMidNight);

        this.save(key, value, duration.getSeconds());
    }

    @Override
    public void save(String key, MessageSendHistory value, long timeout) {
        redisTemplate.opsForValue()
            .set(MESSAGE_SEND_HISTORY_PREFIX + key, value, timeout, timeoutUnit);
    }

    @Override
    public Optional<MessageSendHistory> get(String key) {
        var value = redisTemplate.opsForValue().get(MESSAGE_SEND_HISTORY_PREFIX + key);

        return Optional.ofNullable(objectMapper.convertValue(value, MessageSendHistory.class));
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(MESSAGE_SEND_HISTORY_PREFIX + key);
    }
}
