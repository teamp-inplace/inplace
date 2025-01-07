package team7.inplace.place.persistence;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import team7.inplace.influencer.domain.QInfluencer;
import team7.inplace.place.domain.Category;
import team7.inplace.place.domain.Menu;
import team7.inplace.place.domain.MenuBoardPhoto;
import team7.inplace.place.domain.OffDay;
import team7.inplace.place.domain.OpenTime;
import team7.inplace.place.domain.Place;
import team7.inplace.place.domain.PlaceBulk;
import team7.inplace.place.domain.QMenu;
import team7.inplace.place.domain.QMenuBoardPhoto;
import team7.inplace.place.domain.QOffDay;
import team7.inplace.place.domain.QOpenTime;
import team7.inplace.place.domain.QPlace;
import team7.inplace.video.domain.QVideo;

@Repository
@RequiredArgsConstructor
public class PlaceCustomRepositoryImpl implements PlaceCustomRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<PlaceBulk> findPlaceById(Long id) {
        QPlace qplace = QPlace.place;
        QMenu qmenu = QMenu.menu;
        QOpenTime qopenTime = QOpenTime.openTime;
        QOffDay qoffDay = QOffDay.offDay;
        QMenuBoardPhoto qmenuBoardPhoto = QMenuBoardPhoto.menuBoardPhoto;

        Place place = jpaQueryFactory.selectFrom(qplace)
                .where(qplace.id.eq(id))
                .fetchOne();
        if (place == null) {
            return Optional.empty();
        }

        List<Menu> menus = jpaQueryFactory.selectFrom(qmenu)
                .where(qmenu.placeId.eq(id))
                .fetch();

        List<OpenTime> openTimes = jpaQueryFactory.selectFrom(qopenTime)
                .where(qopenTime.placeId.eq(id))
                .fetch();

        List<OffDay> offDays = jpaQueryFactory.selectFrom(qoffDay)
                .where(qoffDay.placeId.eq(id))
                .fetch();

        List<MenuBoardPhoto> menuBoardPhotos = jpaQueryFactory.selectFrom(qmenuBoardPhoto)
                .where(qmenuBoardPhoto.placeId.eq(id))
                .fetch();

        return Optional.of(new PlaceBulk(place, menus, openTimes, offDays, menuBoardPhotos));
    }

    @Override
    public Page<PlaceBulk> findPlacesByDistance(String longitude, String latitude, Pageable pageable) {
        List<Place> places = getPlaceEntity(longitude, latitude, pageable);

        QPlace qplace = QPlace.place;
        JPAQuery<Long> countQuery = jpaQueryFactory.select(qplace.id.count()) // 중복 제거
                .from(qplace);

        return getPlaceBulks(places, countQuery, pageable);
    }

    @Override
    public Page<PlaceBulk> findPlacesByDistanceAndFilters(
            String topLeftLongitude, String topLeftLatitude,
            String bottomRightLongitude, String bottomRightLatitude,
            String longitude, String latitude,
            List<String> categories, List<String> influencers,
            Pageable pageable
    ) {
        // Place 엔티티 조회
        var places = getPlaceEntity(topLeftLongitude, topLeftLatitude, bottomRightLongitude,
                bottomRightLatitude,
                categories, influencers,
                pageable);
        // Place 개수 조회
        var placeCount = getPlaceCount(topLeftLongitude, topLeftLatitude, bottomRightLongitude,
                bottomRightLatitude, categories, influencers);

        // Place ID 목록 추출
        return getPlaceBulks(places, placeCount, pageable);
    }

    private List<Place> getPlaceEntity(String longitude, String latitude, Pageable pageable) {
        QPlace place = QPlace.place;
        NumberTemplate<Double> distanceExpression = getDistanceExpression(longitude, latitude, place);

        return jpaQueryFactory.selectFrom(place)
                .orderBy(distanceExpression.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    private List<Place> getPlaceEntity(
            String topLeftLongitude, String topLeftLatitude, String bottomRightLongitude, String bottomRightLatitude,
            List<String> categories, List<String> influencers, Pageable pageable
    ) {
        QVideo qVideo = QVideo.video;
        QInfluencer qInfluencer = QInfluencer.influencer;
        QPlace plqPlace = QPlace.place;
        NumberTemplate<Double> distanceExpression = getDistanceExpression(topLeftLongitude, topLeftLatitude, plqPlace);
        return jpaQueryFactory.selectFrom(plqPlace)
                .leftJoin(qVideo).on(qVideo.place.eq(plqPlace))
                .leftJoin(qInfluencer).on(qVideo.influencer.eq(qInfluencer))
                .where(
                        withinBoundary(
                                plqPlace,
                                Double.parseDouble(topLeftLongitude),
                                Double.parseDouble(topLeftLatitude),
                                Double.parseDouble(bottomRightLongitude),
                                Double.parseDouble(bottomRightLatitude)
                        ),
                        placeCategoryIn(categories),
                        placeInfluencerIn(influencers)
                )
                .orderBy(distanceExpression.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    private Page<PlaceBulk> getPlaceBulks(List<Place> places, JPAQuery<Long> countQuery, Pageable pageable) {
        List<Long> placeIds = places.stream()
                .map(Place::getId)
                .toList();
        var menus = getMenus(placeIds);
        var openTimes = getOpenTimes(placeIds);
        var offDays = getOffDays(placeIds);
        var menuBoards = getMenuBoards(placeIds);

        var placeBulks = generatePlaceBulks(places, menus, openTimes, offDays, menuBoards);

        return PageableExecutionUtils.getPage(placeBulks, pageable, countQuery::fetchOne);
    }

    private JPAQuery<Long> getPlaceCount(
            String topLeftLongitude, String topLeftLatitude, String bottomRightLongitude, String bottomRightLatitude,
            List<String> categories, List<String> influencers
    ) {
        QVideo qVideo = QVideo.video;
        QInfluencer qInfluencer = QInfluencer.influencer;
        QPlace qPlace = QPlace.place;

        return jpaQueryFactory
                .select(qPlace.id.count())
                .from(qPlace)
                .leftJoin(qVideo).on(qVideo.place.eq(qPlace))
                .leftJoin(qInfluencer).on(qVideo.influencer.eq(qInfluencer))
                .where(
                        withinBoundary(
                                qPlace,
                                Double.parseDouble(topLeftLongitude),
                                Double.parseDouble(topLeftLatitude),
                                Double.parseDouble(bottomRightLongitude),
                                Double.parseDouble(bottomRightLatitude)
                        ),
                        placeCategoryIn(categories),
                        placeInfluencerIn(influencers)
                );
    }

    private NumberTemplate<Double> getDistanceExpression(String longitude, String latitude, QPlace plqPlace) {
        return Expressions.numberTemplate(Double.class,
                "6371 * acos(cos(radians({0})) * cos(radians(CAST({1} AS DOUBLE))) * " +
                        "cos(radians(CAST({2} AS DOUBLE)) - radians({3})) + sin(radians({0})) * sin(radians(CAST({1} AS DOUBLE))))",
                Double.parseDouble(latitude), plqPlace.coordinate.latitude, plqPlace.coordinate.longitude,
                Double.parseDouble(longitude));
    }

    private BooleanExpression withinBoundary(
            QPlace place, double topLeftLongitude,
            double topLeftLatitude,
            double bottomRightLongitude, double bottomRightLatitude
    ) {
        NumberTemplate<Double> longitude = Expressions.numberTemplate(Double.class,
                "CAST({0} AS DOUBLE)", place.coordinate.longitude);
        NumberTemplate<Double> latitude = Expressions.numberTemplate(Double.class,
                "CAST({0} AS DOUBLE)", place.coordinate.latitude);

        return longitude.between(topLeftLongitude, bottomRightLongitude)
                .and(latitude.between(bottomRightLatitude, topLeftLatitude));
    }

    private BooleanExpression placeCategoryIn(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return null;
        }
        return QPlace.place.category.in(
                categories.stream()
                        .map(Category::of)
                        .collect(Collectors.toList())
        );
    }

    private BooleanExpression placeInfluencerIn(List<String> influencers) {
        if (influencers == null || influencers.isEmpty()) {
            return null;
        }
        return QInfluencer.influencer.name.in(influencers);
    }

    private Map<Long, List<MenuBoardPhoto>> getMenuBoards(List<Long> placeIds) {
        return jpaQueryFactory
                .selectFrom(QMenuBoardPhoto.menuBoardPhoto)
                .where(QMenuBoardPhoto.menuBoardPhoto.placeId.in(placeIds))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(MenuBoardPhoto::getPlaceId));
    }

    private Map<Long, List<OffDay>> getOffDays(List<Long> placeIds) {
        return jpaQueryFactory
                .selectFrom(QOffDay.offDay)
                .where(QOffDay.offDay.placeId.in(placeIds))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(OffDay::getPlaceId));
    }

    private Map<Long, List<OpenTime>> getOpenTimes(List<Long> placeIds) {
        return jpaQueryFactory
                .selectFrom(QOpenTime.openTime)
                .where(QOpenTime.openTime.placeId.in(placeIds))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(OpenTime::getPlaceId));
    }

    private Map<Long, List<Menu>> getMenus(List<Long> placeIds) {
        return jpaQueryFactory
                .selectFrom(QMenu.menu)
                .where(QMenu.menu.placeId.in(placeIds))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(Menu::getPlaceId));
    }

    private List<PlaceBulk> generatePlaceBulks(
            List<Place> places,
            Map<Long, List<Menu>> menus,
            Map<Long, List<OpenTime>> openTimes,
            Map<Long, List<OffDay>> offDays,
            Map<Long, List<MenuBoardPhoto>> menuBoards
    ) {
        return places.stream()
                .map(place -> new PlaceBulk(
                        place,
                        menus.getOrDefault(place.getId(), Collections.emptyList()),
                        openTimes.getOrDefault(place.getId(), Collections.emptyList()),
                        offDays.getOrDefault(place.getId(), Collections.emptyList()),
                        menuBoards.getOrDefault(place.getId(), Collections.emptyList())
                ))
                .toList();
    }
}
