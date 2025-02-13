package team7.inplace.admin.crawling.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import team7.inplace.admin.crawling.application.dto.CrawlingInfo;
import team7.inplace.global.annotation.Facade;
import team7.inplace.video.application.VideoFacade;

@Facade
@Slf4j
@RequiredArgsConstructor
public class CrawlingFacade {

    private final YoutubeCrawlingService youtubeCrawlingService;
    private final VideoFacade videoFacade;

    @Scheduled(cron = "0 0 2 * * *", zone = "Asia/Seoul")
    public void updateVideos() {
        var crawlingInfos = youtubeCrawlingService.crawlAllVideos();
        for (var crawlingInfo : crawlingInfos) {
            var videoCommands = crawlingInfo.toVideoCommands();
            if (videoCommands.isEmpty()) {
                continue;
            }
            videoFacade.createVideos(videoCommands, crawlingInfo.influencerId());
        }
    }

    @Scheduled(cron = "0 30 2 * * *", zone = "Asia/Seoul")
    public void updateVideoView() {
        var crawlingInfos = youtubeCrawlingService.crawlingVideoView();
        var videoCommands = crawlingInfos.stream()
            .map(CrawlingInfo.ViewInfo::toVideoCommand)
            .toList();

        videoFacade.updateVideoViews(videoCommands);
    }
}
