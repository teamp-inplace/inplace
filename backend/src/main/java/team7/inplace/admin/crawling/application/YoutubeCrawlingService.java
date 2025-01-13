package team7.inplace.admin.crawling.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import team7.inplace.admin.crawling.application.dto.CrawlingInfo;
import team7.inplace.admin.crawling.client.YoutubeClient;
import team7.inplace.influencer.persistence.InfluencerRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class YoutubeCrawlingService {
    private final InfluencerRepository influencerRepository;
    private final YoutubeClient youtubeClient;

    /*
        1. 유튜브 채널 정보를 모두 가져온다.
        2. 마지막 비디오와, 유튜브 UUID를 이용하여 비디오 정보를 가져온다.
        3. 마지막 비디오 UUID를 업데이트 한다.
        4. 카카오 API를 호출해 장소 정보를 가져온다
     */
    public List<CrawlingInfo.VideoPlaceInfo> crawlAllVideos() {
        var influencers = influencerRepository.findAll();
        var crawlInfos = influencers.stream()
                .map(influencer -> {
                    var channel = influencer.getChannelId();
                    var lastVideoUUID = influencer.getLastVideo();

                    var videoItems = youtubeClient.getVideos(channel, lastVideoUUID);
                    return new CrawlingInfo.VideoPlaceInfo(influencer.getId(), videoItems);
                }).toList();

        return crawlInfos;
    }
}

