package team7.inplace.admin.persistence;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;
import team7.inplace.infra.s3.AwsProperties;

@Repository
@RequiredArgsConstructor
public class BannerS3Repository {
    private final AmazonS3Client amazonS3Client;
    private final AwsProperties awsProperties;

    public String uploadBanner(String bannerName, MultipartFile banner) {
        var bucketName = awsProperties.bucketName();
        var key = "banner/" + bannerName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(banner.getSize());
        metadata.setContentType(banner.getContentType());

        try {
            amazonS3Client.putObject(bucketName, key, banner.getInputStream(), metadata);
            return amazonS3Client.getUrl(bucketName, key).toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload banner", e);
        }
    }
}
