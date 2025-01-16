package team7.inplace.video.persistence;

import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import team7.inplace.influencer.domain.QInfluencer;
import team7.inplace.liked.likedInfluencer.domain.QLikedInfluencer;
import team7.inplace.place.domain.QPlace;
import team7.inplace.video.domain.QVideo;
import team7.inplace.video.persistence.dto.QVideoQueryResult_SimpleVideo;
import team7.inplace.video.persistence.dto.VideoQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult.SimpleVideo;

@Repository
@RequiredArgsConstructor
public class VideoReadRepositoryImpl implements VideoReadRepository {
    private static final double GRID_SIZE = 0.002;
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<VideoQueryResult.SimpleVideo> findSimpleVideosInSurround(
            Double topLeftLongitude, Double topLeftLatitude,
            Double bottomRightLongitude, Double bottomRightLatitude,
            Double longitude, Double latitude,
            Pageable pageable
    ) {
        NumberExpression<Integer> gridX = QPlace.place.coordinate.longitude
                .subtract(topLeftLongitude)
                .divide(GRID_SIZE)
                .floor()
                .castToNum(Integer.class);

        NumberExpression<Integer> gridY = QPlace.place.coordinate.latitude
                .subtract(bottomRightLatitude)
                .divide(GRID_SIZE)
                .floor()
                .castToNum(Integer.class);

        // Pagination 위한 총 개수 조회
        Long total = queryFactory
                .select(QVideo.video.count())
                .from(QVideo.video)
                .join(QPlace.place)
                .on(QVideo.video.placeId.eq(QPlace.place.id))
                .where(
                        QPlace.place.coordinate.longitude.between(topLeftLongitude, bottomRightLongitude),
                        QPlace.place.coordinate.latitude.between(bottomRightLatitude, topLeftLatitude),
                        QPlace.place.coordinate.longitude.between(longitude - 0.01, longitude + 0.01),
                        QPlace.place.coordinate.latitude.between(latitude - 0.01, latitude + 0.01)
                )
                .fetchOne();

        // 페이징된 결과 조회
        var content = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .join(QPlace.place)
                .on(QVideo.video.placeId.eq(QPlace.place.id))
                .join(QInfluencer.influencer)
                .on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .where(
                        QPlace.place.coordinate.longitude.between(topLeftLongitude, bottomRightLongitude),
                        QPlace.place.coordinate.latitude.between(bottomRightLatitude, topLeftLatitude),
                        QPlace.place.coordinate.longitude.between(longitude - 0.01, longitude + 0.01),
                        QPlace.place.coordinate.latitude.between(latitude - 0.01, latitude + 0.01)
                )
                .orderBy(
                        gridX.add(gridY).asc(),
                        QPlace.place.coordinate.longitude
                                .subtract(longitude)
                                .multiply(QPlace.place.coordinate.longitude.subtract(longitude))
                                .add(QPlace.place.coordinate.latitude.subtract(latitude)
                                        .multiply(QPlace.place.coordinate.latitude.subtract(latitude)))
                                .asc()
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public List<SimpleVideo> findTop10ByViewCountIncrement() {
        var top10Videos = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .join(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .join(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .orderBy(QVideo.video.view.viewCountIncrease.desc())
                .limit(10)
                .fetch();

        return top10Videos;
    }

    @Override
    public List<SimpleVideo> findTop10ByLatestUploadDate() {
        var top10Videos = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .join(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .join(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .orderBy(QVideo.video.publishTime.desc())
                .limit(10)
                .fetch();

        return top10Videos;
    }

    @Override
    public List<SimpleVideo> findTop10ByLikedInfluencer(Long userId) {
        var top10Videos = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .join(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .leftJoin(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .where(QVideo.video.influencerId.in(
                        JPAExpressions
                                .select(QLikedInfluencer.likedInfluencer.influencerId)
                                .from(QLikedInfluencer.likedInfluencer)
                                .where(QLikedInfluencer.likedInfluencer.userId.eq(userId)
                                        .and(QLikedInfluencer.likedInfluencer.isLiked.isTrue()))
                ))
                .orderBy(QVideo.video.publishTime.desc())
                .limit(10)
                .fetch();

        return top10Videos;
    }

    @Override
    public List<SimpleVideo> findSimpleVideoByPlaceId(Long placeId) {
        var videos = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .leftJoin(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .leftJoin(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .where(QVideo.video.placeId.eq(placeId))
                .fetch();

        return videos;
    }

    @Override
    public Map<Long, List<SimpleVideo>> findSimpleVideosByPlaceIds(List<Long> placeIds) {
        if (placeIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .join(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .join(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .where(QVideo.video.placeId.in(placeIds))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(SimpleVideo::placeId));
    }

    @Override
    public Page<SimpleVideo> findVideoWithNoPlace(Pageable pageable) {
        var videos = queryFactory
                .select(new QVideoQueryResult_SimpleVideo(
                        QVideo.video.id,
                        QVideo.video.uuid,
                        QInfluencer.influencer.name,
                        QPlace.place.id,
                        QPlace.place.name,
                        QPlace.place.category
                ))
                .from(QVideo.video)
                .leftJoin(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
                .join(QInfluencer.influencer).on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
                .where(QVideo.video.placeId.isNull())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        var total = queryFactory
                .select(QVideo.video.count())
                .from(QVideo.video)
                .where(QVideo.video.placeId.isNull())
                .fetchOne();

        return new PageImpl<>(videos, pageable, total);
    }
}