package team7.inplace.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "youtube.api")
public record YoutubeApiProperties(
        String key
) {
}
