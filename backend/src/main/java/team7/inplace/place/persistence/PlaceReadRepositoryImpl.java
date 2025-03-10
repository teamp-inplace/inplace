package team7.inplace.place.persistence;

import static com.querydsl.core.types.ExpressionUtils.count;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import team7.inplace.influencer.domain.QInfluencer;
import team7.inplace.liked.likedPlace.domain.QLikedPlace;
import team7.inplace.place.domain.Category;
import team7.inplace.place.domain.QPlace;
import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.place.persistence.dto.PlaceQueryResult.Marker;
import team7.inplace.place.persistence.dto.PlaceQueryResult.SimplePlace;
import team7.inplace.place.persistence.dto.QPlaceQueryResult_DetailedPlace;
import team7.inplace.place.persistence.dto.QPlaceQueryResult_Location;
import team7.inplace.place.persistence.dto.QPlaceQueryResult_Marker;
import team7.inplace.place.persistence.dto.QPlaceQueryResult_SimplePlace;
import team7.inplace.video.domain.QVideo;

@Repository
@RequiredArgsConstructor
public class PlaceReadRepositoryImpl implements PlaceReadRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<PlaceQueryResult.DetailedPlace> findDetailedPlaceById(
        Long placeId,
        Long userId
    ) {
        var detailedPlace = jpaQueryFactory
            .select(new QPlaceQueryResult_DetailedPlace(
                QPlace.place.id,
                QPlace.place.name,
                QPlace.place.address.address1,
                QPlace.place.address.address2,
                QPlace.place.address.address3,
                QPlace.place.coordinate.longitude,
                QPlace.place.coordinate.latitude,
                QPlace.place.category,
                QPlace.place.googlePlaceId,
                QPlace.place.kakaoPlaceId,
                QLikedPlace.likedPlace.isLiked.isNotNull()
            ))
            .from(QPlace.place)
            .leftJoin(QLikedPlace.likedPlace).on(QLikedPlace.likedPlace.placeId.eq(QPlace.place.id)
                .and(userId != null ?
                    QLikedPlace.likedPlace.userId.eq(userId) :
                    QLikedPlace.likedPlace.userId.isNull())
                .and(QLikedPlace.likedPlace.isLiked.isTrue()))
            .where(
                QPlace.place.id.eq(placeId),
                QPlace.place.deleteAt.isNull(),
                QLikedPlace.likedPlace.deleteAt.isNull()
            )
            .fetchOne();
        if (detailedPlace == null) {
            return Optional.empty();
        }

        return Optional.of(detailedPlace);
    }

    @Override
    public Page<PlaceQueryResult.DetailedPlace> findPlacesInMapRangeWithPaging(
        Double topLeftLongitude, Double topLeftLatitude,
        Double bottomRightLongitude, Double bottomRightLatitude,
        Double longitude, Double latitude,
        List<Category> categoryFilters, List<String> influencerFilters,
        Pageable pageable,
        Long userId
    ) {
        var filterExpression = createFilters(categoryFilters, influencerFilters);
        /* 조건에 맞는 장소 ID 목록 조회 */
        List<Long> filteredPlaceId = jpaQueryFactory
            .select(QPlace.place.id).distinct()
            .from(QPlace.place)
            .leftJoin(QVideo.video).on(QVideo.video.placeId.eq(QPlace.place.id))
            .leftJoin(QInfluencer.influencer)
            .on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
            .where(
                QPlace.place.coordinate.longitude.between(topLeftLongitude, bottomRightLongitude),
                QPlace.place.coordinate.latitude.between(bottomRightLatitude, topLeftLatitude),
                filterExpression,
                QPlace.place.deleteAt.isNull(),
                QVideo.video.deleteAt.isNull(),
                QInfluencer.influencer.deleteAt.isNull()
            ).fetch();
        /* 필터링 된 장소 ID 목록으로 장소 상세 정보 조회 */
        List<PlaceQueryResult.DetailedPlace> places = jpaQueryFactory
            .select(new QPlaceQueryResult_DetailedPlace(
                QPlace.place.id,
                QPlace.place.name,
                QPlace.place.address.address1,
                QPlace.place.address.address2,
                QPlace.place.address.address3,
                QPlace.place.coordinate.longitude,
                QPlace.place.coordinate.latitude,
                QPlace.place.category,
                QPlace.place.googlePlaceId,
                QPlace.place.kakaoPlaceId,
                QLikedPlace.likedPlace.isLiked.isNotNull()
            )).distinct()
            .from(QPlace.place)
            .leftJoin(QVideo.video).on(QVideo.video.placeId.eq(QPlace.place.id))
            .leftJoin(QInfluencer.influencer)
            .on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
            .leftJoin(QLikedPlace.likedPlace).on(QLikedPlace.likedPlace.placeId.eq(QPlace.place.id)
                .and(userId != null ?
                    QLikedPlace.likedPlace.userId.eq(userId) :
                    QLikedPlace.likedPlace.userId.isNull())
                .and(QLikedPlace.likedPlace.isLiked.isTrue()))
            .where(
                QPlace.place.coordinate.longitude.between(topLeftLongitude, bottomRightLongitude),
                QPlace.place.coordinate.latitude.between(bottomRightLatitude, topLeftLatitude),
                filterExpression,
                QPlace.place.deleteAt.isNull(),
                QVideo.video.deleteAt.isNull(),
                QInfluencer.influencer.deleteAt.isNull(),
                QLikedPlace.likedPlace.deleteAt.isNull()
            )
            .orderBy(QPlace.place.id.asc())
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

        if (places.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }
        return PageableExecutionUtils.getPage(places, pageable, filteredPlaceId::size);
    }

    @Override
    public List<PlaceQueryResult.Location> findPlaceLocationsInMapRange(
        Double topLeftLongitude,
        Double topLeftLatitude,
        Double bottomRightLongitude,
        Double bottomRightLatitude,
        List<Category> categoryFilters,
        List<String> influencerFilters
    ) {
        var filterExpression = createFilters(categoryFilters, influencerFilters);

        List<Long> filteredPlaceId = jpaQueryFactory
            .select(QPlace.place.id).distinct()
            .from(QVideo.video)
            .leftJoin(QInfluencer.influencer)
            .on(QVideo.video.influencerId.eq(QInfluencer.influencer.id))
            .leftJoin(QPlace.place).on(QVideo.video.placeId.eq(QPlace.place.id))
            .where(
                QPlace.place.coordinate.longitude.between(topLeftLongitude, bottomRightLongitude),
                QPlace.place.coordinate.latitude.between(bottomRightLatitude, topLeftLatitude),
                filterExpression,
                QVideo.video.placeId.isNotNull(),
                QVideo.video.deleteAt.isNull(),
                QInfluencer.influencer.deleteAt.isNull(),
                QPlace.place.deleteAt.isNull()
            ).fetch();

        return jpaQueryFactory
            .select(new QPlaceQueryResult_Location(
                    QPlace.place.id,
                    QPlace.place.coordinate.longitude,
                    QPlace.place.coordinate.latitude
                )
            )
            .from(QPlace.place)
            .where(QPlace.place.id.in(filteredPlaceId))
            .fetch();
    }

    private BooleanBuilder createFilters(
        List<Category> categoryFilters, List<String> influencerFilters
    ) {
        BooleanBuilder expression = new BooleanBuilder();
        if (categoryFilters != null && categoryFilters.size() > 0) {
            expression.and(QPlace.place.category.in(categoryFilters));
        }

        if (influencerFilters != null && influencerFilters.size() > 0) {
            expression.and(QInfluencer.influencer.name.in(influencerFilters));
        }

        return expression;
    }

    @Override
    public Optional<SimplePlace> findSimplePlaceById(Long placeId) {
        var simplePlace = jpaQueryFactory
            .select(new QPlaceQueryResult_SimplePlace(
                QPlace.place.id,
                QPlace.place.name,
                QPlace.place.address.address1,
                QPlace.place.address.address2,
                QPlace.place.address.address3
            ))
            .from(QPlace.place)
            .where(
                QPlace.place.id.eq(placeId),
                QPlace.place.deleteAt.isNull()
            )
            .fetchOne();
        if (simplePlace == null) {
            return Optional.empty();
        }
        return Optional.of(simplePlace);
    }


    @Override
    public Page<PlaceQueryResult.DetailedPlace> findLikedPlacesByUserIdWithPaging(
        Long userId,
        Pageable pageable
    ) {
        var likedPlaceCount = jpaQueryFactory
            .select(count(QLikedPlace.likedPlace.id))
            .from(QLikedPlace.likedPlace)
            .where(
                QLikedPlace.likedPlace.userId.eq(userId),
                QLikedPlace.likedPlace.isLiked.isTrue(),
                QLikedPlace.likedPlace.deleteAt.isNull()
            )
            .fetchOne();

        if (likedPlaceCount == null || likedPlaceCount == 0) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        var likedPlaces = jpaQueryFactory
            .select(new QPlaceQueryResult_DetailedPlace(
                QPlace.place.id,
                QPlace.place.name,
                QPlace.place.address.address1,
                QPlace.place.address.address2,
                QPlace.place.address.address3,
                QPlace.place.coordinate.longitude,
                QPlace.place.coordinate.latitude,
                QPlace.place.category,
                QPlace.place.googlePlaceId,
                QPlace.place.kakaoPlaceId,
                QLikedPlace.likedPlace.isLiked.isTrue()
            ))
            .from(QLikedPlace.likedPlace)
            .leftJoin(QPlace.place).on(QLikedPlace.likedPlace.placeId.eq(QPlace.place.id))
            .where(
                QLikedPlace.likedPlace.userId.eq(userId),
                QLikedPlace.likedPlace.isLiked.isTrue(),
                QLikedPlace.likedPlace.deleteAt.isNull(),
                QPlace.place.deleteAt.isNull()
            )
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

        return PageableExecutionUtils.getPage(likedPlaces, pageable, likedPlaceCount::intValue);
    }

    @Override
    public Marker findPlaceMarkerById(Long placeId) {
        return jpaQueryFactory
            .select(new QPlaceQueryResult_Marker(
                QPlace.place.id,
                QPlace.place.name,
                QPlace.place.category,
                QPlace.place.address.address1,
                QPlace.place.address.address2,
                QPlace.place.address.address3
            ))
            .from(QPlace.place)
            .where(QPlace.place.id.eq(placeId))
            .fetchOne();
    }
}
