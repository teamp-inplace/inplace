package team7.inplace.video.persistence;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import team7.inplace.video.persistence.dto.VideoQueryResult;

public interface VideoReadRepository {
    Page<VideoQueryResult.SimpleVideo> findSimpleVideosInSurround(
            Double topLeftLongitude,
            Double topLeftLatitude,
            Double bottomRightLongitude,
            Double bottomRightLatitude,
            Double longitude,
            Double latitude,
            Pageable pageable
    );

    List<VideoQueryResult.SimpleVideo> findTop10ByViewCountIncrement();

    List<VideoQueryResult.SimpleVideo> findTop10ByLatestUploadDate();

    List<VideoQueryResult.SimpleVideo> findTop10ByLikedInfluencer(Long userId);

    List<VideoQueryResult.SimpleVideo> findSimpleVideoByPlaceId(Long placeId);

    Map<Long, List<VideoQueryResult.SimpleVideo>> findSimpleVideosByPlaceIds(List<Long> placeIds);

    Page<VideoQueryResult.SimpleVideo> findVideoWithNoPlace(Pageable pageable);
}
