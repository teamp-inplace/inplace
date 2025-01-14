package team7.inplace.global.redis;

import java.util.Optional;

public interface RedisRepository<T> {
    void save(String key, T value);

    void save(String key, T value, long timeout);

    Optional<T> get(String key);

    void delete(String key);
}