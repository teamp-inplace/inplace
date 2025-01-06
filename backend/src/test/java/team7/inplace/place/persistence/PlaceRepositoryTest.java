package team7.inplace.place.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import team7.inplace.global.queryDsl.QueryDslConfig;
import team7.inplace.influencer.domain.Influencer;
import team7.inplace.place.domain.Category;
import team7.inplace.place.domain.Place;
import team7.inplace.place.domain.PlaceBulk;
import team7.inplace.video.domain.Video;


@DataJpaTest
@Import(QueryDslConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PlaceRepositoryTest {

    @PersistenceContext
    EntityManager entityManager;
    String topLeftLongitude = "10.0";

    //     * 테스트 Place 좌표 (longitude, latitude)
//     * (10.0, 10.0) -> video1 -> 성시경
//     * (10.0, 50.0)
//     * (10.0, 100.0)
//     * (50.0, 50.0) -> video2 -> 아이유
//     *
//     * 테스트 좌표
//     * (10.0, 51.0)
//     *
//     * boundary 좌표
//     * 좌상단: (10.0, 60.0)
//     * 우하단: (50.0, 10.0)
    String topLeftLatitude = "60.0";
    String bottomRightLongitude = "50.0";
    String bottomRightLatitude = "10.0";
    String longitude = "10.0";
    String latitude = "51.0";
    Pageable pageable = PageRequest.of(0, 10);
    @Autowired
    private PlaceRepository placeRepository;

    @BeforeEach
    public void init() {
        Place place1 = new Place("Place 1",
                "\"wifi\": true, \"pet\": false, \"parking\": false, \"forDisabled\": true, \"nursery\": false, \"smokingRoom\": false}",
                "menuImg.url", "카페",
                "Address 1|Address 2|Address 3",
                "10.0", "10.0",
                LocalDateTime.of(2024, 3, 28, 5, 30)
        );

        Place place2 = new Place("Place 2",
                "\"wifi\": true, \"pet\": false, \"parking\": false, \"forDisabled\": true, \"nursery\": false, \"smokingRoom\": false}",
                "menuImg.url", "일식",
                "Address 1|Address 2|Address 3",
                "10.0", "50.0",
                LocalDateTime.of(2024, 3, 28, 5, 30)
        );

        Place place3 = new Place("Place 3",
                "\"wifi\": true, \"pet\": false, \"parking\": false, \"forDisabled\": true, \"nursery\": false, \"smokingRoom\": false}",
                "menuImg.url", "카페",
                "Address 1|Address 2|Address 3",
                "10.0", "100.0",
                LocalDateTime.of(2024, 3, 28, 5, 30)
        );

        Place place4 = new Place("Place 4",
                "\"wifi\": true, \"pet\": false, \"parking\": false, \"forDisabled\": true, \"nursery\": false, \"smokingRoom\": false}",
                "menuImg.url", "일식",
                "Address 1|Address 2|Address 3",
                "50.0", "50.0",
                LocalDateTime.of(2024, 3, 28, 5, 30)
        );

        entityManager.persist(place1);
        entityManager.persist(place2);
        entityManager.persist(place3);
        entityManager.persist(place4);

        Influencer influencer1 = new Influencer("성시경", "가수", "img.url");
        Influencer influencer2 = new Influencer("아이유", "가수", "img.rul");
        entityManager.persist(influencer1);
        entityManager.persist(influencer2);

        Video video1 = Video.from(influencer1, place1, "video.url");
        Video video2 = Video.from(influencer2, place4, "video.url");

        entityManager.persist(video1);
        entityManager.persist(video2);

        pageable = PageRequest.of(0, 10);
    }

    @Test
    @DisplayName("거리 기반 장소 조회")
    public void test1() {
        // given

        // when
        Page<PlaceBulk> foundPlaces = placeRepository.findPlacesByDistance(
                longitude,
                latitude,
                pageable
        );
        System.out.println(foundPlaces);

        // Then
        assertThat(foundPlaces).hasSize(4);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 2");
        assertThat(foundPlaces.getContent().get(1).getPlace().getName()).isEqualTo("Place 4");
        assertThat(foundPlaces.getContent().get(2).getPlace().getName()).isEqualTo("Place 1");
        assertThat(foundPlaces.getContent().get(3).getPlace().getName()).isEqualTo("Place 3");
    }

    @Test
    @DisplayName("필터링 NULL, boundary[(10, 60), (50, 10)]")
    public void test2() {

//         * Place 3(10.0, 100.0) 제외
        // given
        List<String> categories = null;
        List<String> influencers = null;

        // when
        Page<PlaceBulk> foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );
        assertThat(foundPlaces.getTotalElements()).isEqualTo(3);
        // Then
        assertThat(foundPlaces).hasSize(3);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 2");
        assertThat(foundPlaces.getContent().get(1).getPlace().getName()).isEqualTo("Place 4");
        assertThat(foundPlaces.getContent().get(2).getPlace().getName()).isEqualTo("Place 1");

    }

    @Test
    @DisplayName("카테고리(japan, cafe) 필터링")
    public void test3() {
        // given
        List<String> categories = Arrays.asList(Category.CAFE.getName(),
                Category.JAPANESE.getName());

        List<String> influencers = null;
        // when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );
        // Then
        assertThat(foundPlaces).hasSize(3);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 2");
        assertThat(foundPlaces.getContent().get(0).getPlace().getCategory()).isEqualTo(Category.JAPANESE);
        assertThat(foundPlaces.getContent().get(1).getPlace().getName()).isEqualTo("Place 4");
        assertThat(foundPlaces.getContent().get(1).getPlace().getCategory()).isEqualTo(Category.JAPANESE);
        assertThat(foundPlaces.getContent().get(2).getPlace().getName()).isEqualTo("Place 1");
        assertThat(foundPlaces.getContent().get(2).getPlace().getCategory()).isEqualTo(Category.CAFE);
    }

    @Test
    @DisplayName("카테고리(japan) 필터링")
    public void test4() {
        // given
        List<String> categories = Arrays.asList(Category.JAPANESE.getName());
        List<String> influencers = null;
        // when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );
        // Then
        assertThat(foundPlaces).hasSize(2);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 2");
        assertThat(foundPlaces.getContent().get(0).getPlace().getCategory()).isEqualTo(Category.JAPANESE);
        assertThat(foundPlaces.getContent().get(1).getPlace().getName()).isEqualTo("Place 4");
        assertThat(foundPlaces.getContent().get(1).getPlace().getCategory()).isEqualTo(Category.JAPANESE);
    }

    @Test
    @DisplayName("인플루언서(아이유, 성시경) 필터링")
    public void test5() {
        // given
        List<String> categories = null;
        List<String> influencers = List.of("성시경", "아이유");

        //when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );

        //then
        assertThat(foundPlaces).hasSize(2);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 4");
        assertThat(foundPlaces.getContent().get(1).getPlace().getName()).isEqualTo("Place 1");
    }

    @Test
    @DisplayName("인플루언서(성시경) 필터링")
    public void test6() {
        // given
        List<String> categories = null;
        List<String> influencers = List.of("성시경");

        //when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );

        //then
        assertThat(foundPlaces).hasSize(1);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 1");
    }

    @Test
    @DisplayName("카테고리(Japanese), 인플루언서(아이유) 필터링")
    public void test7() {
        // given
        List<String> categories = Arrays.asList(Category.JAPANESE.getName());
        List<String> influencers = List.of("아이유");

        //when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );

        //then
        assertThat(foundPlaces).hasSize(1);
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 4");
    }

    // Pagenation
    @Test
    @DisplayName("page=1&size=2, 필터링 NULL, boundary[(10, 60), (50, 10)]")
    public void test8() {

//        * Place 3(10.0, 100.0) 제외
//        * Place 2, Place 4는 page=0이라 제외, totalPages, totalElements에는 포함됨
        // given
        List<String> categories = null;
        List<String> influencers = null;
        pageable = PageRequest.of(1, 2);

        // when
        var foundPlaces = placeRepository.findPlacesByDistanceAndFilters(
                topLeftLongitude,
                topLeftLatitude,
                bottomRightLongitude,
                bottomRightLatitude,
                longitude,
                latitude,
                categories,
                influencers,
                pageable
        );
        // Then
//        pagenation
        assertThat(foundPlaces.getTotalElements()).isEqualTo(3);
        assertThat(foundPlaces.getTotalPages()).isEqualTo(2);
        assertThat(foundPlaces).hasSize(1);
//        places
        assertThat(foundPlaces.getContent().get(0).getPlace().getName()).isEqualTo("Place 1");

    }
}
