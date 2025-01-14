package team7.inplace.global.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aws")
public record AwsProperties(
        String accessKey,
        String secretKey,
        String region,
        String bucketName
) {
}
