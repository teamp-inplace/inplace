package team7.inplace.admin.banner.persistence;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;
import team7.inplace.global.properties.AwsProperties;

@Repository
@Slf4j
@RequiredArgsConstructor
public class BannerS3Repository {
    private final AmazonS3Client amazonS3Client;
    private final AwsProperties awsProperties;

    public String uploadBanner(MultipartFile banner) {
        var bucketName = awsProperties.bucketName();
        var key = "banner/" + UUID.randomUUID();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(banner.getSize());
        metadata.setContentType(banner.getContentType());

        try {
            amazonS3Client.putObject(bucketName, key, banner.getInputStream(), metadata);
            return "https://d4oqudml6s9ih.cloudfront.net/" + key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload banner", e);
        }
    }

    public void deleteBanner(String imgPath) {
        var bucketName = awsProperties.bucketName();
        var key = imgPath.substring(imgPath.lastIndexOf("banner"));

        try {
            amazonS3Client.deleteObject(bucketName, key);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete banner", e);
        }
    }
}
