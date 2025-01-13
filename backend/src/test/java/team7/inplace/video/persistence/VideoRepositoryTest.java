package team7.inplace.video.persistence;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.assertj.core.api.Assertions;
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
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.PlaceErrorCode;
import team7.inplace.global.exception.code.VideoErrorCode;
import team7.inplace.global.queryDsl.QueryDslConfig;
import team7.inplace.influencer.domain.Influencer;
import team7.inplace.place.domain.Place;
import team7.inplace.video.domain.Video;

@DataJpaTest
@Import(QueryDslConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class VideoRepositoryTest {

    private final Pageable pageable = PageRequest.of(0, 10);
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private PlaceRepository placeRepository;

    @BeforeEach
    void init() {
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
        entityManager.persist(place1);
        entityManager.persist(place2);

        Influencer influencer1 = new Influencer("name1", "job1", "imgUrl");
        Influencer influencer2 = new Influencer("name2", "job2", "imgUrl");
        entityManager.persist(influencer1);
        entityManager.persist(influencer2);

        Video video1 = Video.from(influencer1, place1, "url1");
        Video video2 = Video.from(influencer1, place1, "url2");
        Video video3 = Video.from(influencer1, place1, "url3");
        Video video4 = Video.from(influencer1, place1, "url4");
        Video video5 = Video.from(influencer1, place1, "url5");
        Video video6 = Video.from(influencer2, place2, "url6");
        Video video7 = Video.from(influencer2, place2, "url7");
        Video video8 = Video.from(influencer2, place2, "url8");
        Video video9 = Video.from(influencer2, place2, "url9");
        Video video10 = Video.from(influencer2, place2, "url10");
        Video outBoundaryVideo = Video.from(influencer2, place2, "url");
        Video video12 = Video.from(influencer1, null, "url12");
        Video video13 = Video.from(influencer2, null, "url13");
        entityManager.persist(video1);
        entityManager.persist(video2);
        entityManager.persist(video3);
        entityManager.persist(video4);
        entityManager.persist(video5);
        entityManager.persist(video6);
        entityManager.persist(video7);
        entityManager.persist(video8);
        entityManager.persist(video9);
        entityManager.persist(video10);
        entityManager.persist(outBoundaryVideo);
        entityManager.persist(video12);
        entityManager.persist(video13);
    }

    @Test
    @DisplayName("findVideosByInfluencerIdIn Test")
    void test1() {
        // given
        /* Before Each */

        // when
        List<Long> influencerIds = new ArrayList<>();
        influencerIds.add(1L);

        List<Video> savedVideos = videoRepository.findTop10ByInfluencerIdIn(
                influencerIds,
                pageable
        );
        // then
        Assertions.assertThat(savedVideos.size()).isEqualTo(5);
        Long count = 5L;
        for (Video savedVideo : savedVideos) {
            Assertions.assertThat(savedVideo.getId()).isEqualTo(count);
            count = count - 1L;
        }
    }

    @Test
    @DisplayName("findVideosByInfluencerIdIn Top Boundary Test")
    void test1_1() {
        // given
        /* Before Each */

        // when
        List<Long> influencerIds = Arrays.asList(1L, 2L);

        List<Video> savedVideos = videoRepository.findTop10ByInfluencerIdIn(
                influencerIds,
                pageable
        );
        // then
        Assertions.assertThat(savedVideos.size()).isEqualTo(10);
        Long count = 11L;
        for (Video savedVideo : savedVideos) {
            Assertions.assertThat(savedVideo.getId()).isEqualTo(count);
            count = count - 1L;
        }
    }

    @Test
    @DisplayName("findVideosByInfluencerIdIn Bottom Boundary Test")
    void test1_2() {
        // given
        /* Before Each */

        // when
        List<Long> influencerIds = List.of();

        List<Video> savedVideos = videoRepository.findTop10ByInfluencerIdIn(
                influencerIds,
                pageable
        );
        // then
        Assertions.assertThat(savedVideos.size()).isEqualTo(0);
    }

    @Test
    @DisplayName("findTop10ByOrderByIdDesc Test")
    void test2() {
        // given
        /* Before Each */

        // when
        List<Video> videos = videoRepository.findTop10ByOrderByIdDesc(pageable);

        // then
        Assertions.assertThat(videos.size()).isEqualTo(10);
        Long number = 11L;
        for (Video video : videos) {
            Assertions.assertThat(video.getId()).isEqualTo(number);
            number -= 1L;
        }
    }

    @Test
    @DisplayName("findAllByPlaceIsNull Test")
    void test3() {
        // given

        // when
        Page<Video> videos = videoRepository.findAllByPlaceIsNull(pageable);
        // then
        Assertions.assertThat(videos.getContent().size()).isEqualTo(2);
        for (Video video : videos) {
            Assertions.assertThat(video.getPlace()).isNull();
        }
    }

    @Test
    @DisplayName("findTopByPlaceOrderByIdDesc Test")
    void test4() {
        // given

        // when
        Place place = placeRepository.findById(1L)
                .orElseThrow(() -> InplaceException.of(PlaceErrorCode.NOT_FOUND));
        Video video = videoRepository.findTopByPlaceOrderByIdDesc(place)
                .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));

        // then
        Assertions.assertThat(video).isNotNull();
        Assertions.assertThat(video.getId()).isEqualTo(5L);
    }

    @Test
    @DisplayName("findByPlaceIdIn Test")
    void test5() {
        // given

        // when
        List<Long> ids = Arrays.asList(1L, 2L);
        List<Video> videos = videoRepository.findByPlaceIdIn(ids);
        // then
        Assertions.assertThat(videos.size()).isEqualTo(11);
    }

    @Test
    @DisplayName("findByPlaceIdIn Top Boundary Test")
    void test5_1() {
        // given

        // when
        List<Long> ids = Arrays.asList(1L, 2L);
        List<Video> videos = videoRepository.findByPlaceIdIn(ids);
        // then
        Assertions.assertThat(videos.size()).isEqualTo(11);
        Long count = 1L;
        for (Video video : videos) {
            Assertions.assertThat(video.getId()).isEqualTo(count);
            count += 1L;
        }
    }

    @Test
    @DisplayName("findByPlaceIdIn Bottom Boundary Test")
    void test5_2() {
        // given

        // when
        List<Long> ids = List.of();
        List<Video> videos = videoRepository.findByPlaceIdIn(ids);
        // then
        Assertions.assertThat(videos.size()).isEqualTo(0);
    }

    @Test
    @DisplayName("findByPlaceId Test")
    void test6() {
        // given

        // when
        List<Video> videos = videoRepository.findByPlaceId(1L);
        // then
        Assertions.assertThat(videos.size()).isEqualTo(5);
        Long count = 1L;
        for (Video video : videos) {
            Assertions.assertThat(video.getId()).isEqualTo(count);
            count += 1L;
        }
    }

    @Test
    @DisplayName("findVideosByOrderByViewCountIncreaseDesc Test")
    void test7() {
        // given

        // when
        for (int i = 1; i <= 11; i++) {
            Video video = videoRepository.findById((long) i)
                    .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));
            video.updateViewCount(1L);
        }

        for (int i = 1; i <= 11; i++) {
            Video video = videoRepository.findById((long) i)
                    .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));
            video.updateViewCount((long) i);
        }

        List<Video> videos = videoRepository.findTop10ByOrderByViewCountIncreaseDesc(pageable);
        // then
        Assertions.assertThat(videos.size()).isEqualTo(10);
        Long count = 11L;
        for (Video video : videos) {
            Assertions.assertThat(video.getId()).isEqualTo(count);
            count -= 1L;
        }
    }
}
