package team7.inplace.video.domain;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "videos")
@NoArgsConstructor(access = PROTECTED)
public class Video {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(name = "video_url", nullable = false, columnDefinition = "TEXT")
    private String videoUrl;

    @Embedded
    private View view;

    private LocalDateTime publishTime;

    private Long influencerId;

    private Long placeId;

    public Video(String videoUrl, LocalDateTime publishTime, Long influencerId) {
        this.videoUrl = videoUrl;
        this.view = new View();
        this.publishTime = publishTime;
        this.influencerId = influencerId;
    }

    public static Video from(String videoUrl, LocalDateTime publishTime, Long influencerId) {
        return new Video(videoUrl, publishTime, influencerId);
    }

    public String getVideoUrl() {
        return String.format("https://www.youtube.com/watch?v=%s", videoUrl);
    }

    public String getVideoUUID() {
        return videoUrl;
    }

    public Long getViewCount() {
        return view.getViewCount();
    }

    public Long getViewCountIncrease() {
        return view.getViewCountIncrease();
    }

    public void updateViewCount(Long viewCount) {
        view.updateViewCount(viewCount);
    }

    public void addPlace(Long placeId) {
        this.placeId = placeId;
    }
}
