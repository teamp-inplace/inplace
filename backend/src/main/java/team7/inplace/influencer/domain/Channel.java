package team7.inplace.influencer.domain;

import static lombok.AccessLevel.*;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor(access = PROTECTED)
public class Channel {
    private String channelTitle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String channelId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String lastVideoId;

    public Channel(String channelTitle, String channelId) {
        this.channelTitle = channelTitle;
        this.channelId = channelId;
        this.lastVideoId = null;
    }

    public void updateLastVideo(String lastVideoId) {
        this.lastVideoId = lastVideoId;
    }
}
