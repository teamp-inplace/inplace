package team7.inplace.influencer.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Entity(name = "influencers")
@NoArgsConstructor(access = PROTECTED)
public class Influencer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 20)
    private String job;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imgUrl;

    @Embedded
    private Channel channel;

    public Influencer(String name, String imgUrl, String job, String title, String channelId) {
        this.name = name;
        this.imgUrl = imgUrl;
        this.job = job;
        this.channel = new Channel(title, channelId);
    }

    public void update(String name, String imgUrl, String job) {
        this.name = name;
        this.imgUrl = imgUrl;
        this.job = job;
    }

    public void updateLastVideo(String lastVideoId) {
        this.channel.updateLastVideo(lastVideoId);
    }
}
