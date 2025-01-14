package team7.inplace.global.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "youtube.api")
public record YoutubeApiProperties(
        String key
) {
}
