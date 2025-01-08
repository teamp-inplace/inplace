package team7.inplace.video.persistence;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import team7.inplace.video.persistence.dto.VideoQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult.SimpleVideo;

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

    List<SimpleVideo> findTop10ByViewCountIncrement();

    List<SimpleVideo> findTop10ByLatestUploadDate();

    List<SimpleVideo> findTop10ByLikedInfluencer(Long userId);

    List<SimpleVideo> findSimpleVideoByPlaceId(Long placeId);

    Map<Long, List<SimpleVideo>> findSimpleVideosByPlaceIds(List<Long> placeIds);
}
