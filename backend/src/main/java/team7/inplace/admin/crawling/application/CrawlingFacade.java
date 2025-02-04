package team7.inplace.admin.crawling.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import team7.inplace.admin.crawling.application.command.PlaceRegistrationCommand;
import team7.inplace.admin.crawling.application.dto.CrawlingInfo;
import team7.inplace.global.annotation.Facade;
import team7.inplace.place.application.command.PlacesCommand;
import team7.inplace.video.application.VideoFacade;

@Facade
@Slf4j
@RequiredArgsConstructor
public class CrawlingFacade {

    private final YoutubeCrawlingService youtubeCrawlingService;
    private final VideoCrawlingService videoCrawlingService;
    private final KakaoCrawlingService kakaoCrawlingService;
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
        var crawlingInfos = videoCrawlingService.crawlingVideoView();
        var videoCommands = crawlingInfos.stream()
            .map(CrawlingInfo.ViewInfo::toVideoCommand)
            .toList();
        videoFacade.updateVideoViews(videoCommands);
    }

    public void addPlaceInfo(PlaceRegistrationCommand placeRegistrationCommand) {
        var placeInfo = kakaoCrawlingService.searchPlaceWithPlaceId(
            placeRegistrationCommand.placeUUID()
        );
        var placeCommand = PlacesCommand.Create.from(
            placeInfo.locationNode(),
            placeInfo.placeNode(),
            placeRegistrationCommand.category()
        );
        videoFacade.addPlaceInfo(placeRegistrationCommand.videoId(), placeCommand);
    }
}
