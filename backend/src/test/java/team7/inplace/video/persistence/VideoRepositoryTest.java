package team7.inplace.video.persistence;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import team7.inplace.global.config.QueryDslConfig;
import team7.inplace.influencer.domain.Influencer;
import team7.inplace.liked.likedInfluencer.domain.LikedInfluencer;
import team7.inplace.place.domain.Place;
import team7.inplace.security.application.dto.CustomOAuth2User;
import team7.inplace.user.domain.Role;
import team7.inplace.video.domain.Video;
import team7.inplace.video.persistence.dto.VideoQueryResult;

@DataJpaTest
@Import({QueryDslConfig.class, VideoReadRepositoryImpl.class})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class VideoRepositoryTest {
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    private VideoReadRepositoryImpl videoRepository;

    @BeforeEach
    void init() {
        setUser();

        Influencer influencer1 = new Influencer("i1", "url", "job", "title", "channel");
        Influencer influencer2 = new Influencer("i2", "url", "job", "title", "channel");
        Influencer influencer3 = new Influencer("i3", "url", "job", "title", "channel");
        entityManager.persist(influencer1);
        entityManager.persist(influencer2);
        entityManager.persist(influencer3);

        LikedInfluencer likedInfluencer1 = new LikedInfluencer(1L, 1L, true);
        LikedInfluencer likedInfluencer2 = new LikedInfluencer(1L, 2L, true);
        LikedInfluencer likedInfluencer3 = new LikedInfluencer(1L, 3L, true);
        entityManager.persist(likedInfluencer1);
        entityManager.persist(likedInfluencer2);
        entityManager.persist(likedInfluencer3);

        Place place = new Place("place1", "fa", "url", "카페", "1 2 3", "1231", "1212", null);
        entityManager.persist(place);

        Video video1 = new Video("uuid1", null, 1L);
        Video video2 = new Video("uuid2", null, 2L);
        Video video3 = new Video("uuid3", null, 3L);
        video1.addPlace(1L);
        video2.addPlace(1L);
        video3.addPlace(1L);
        entityManager.persist(video1);
        entityManager.persist(video2);
        entityManager.persist(video3);
    }

    @AfterEach
    void tearDown() {
        entityManager.clear();
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("findTop10ByLikedInfluencer Test")
    void test1() {
        // given
        /* Before Each */
        // when
        List<VideoQueryResult.SimpleVideo> savedVideos = videoRepository.findTop10ByLikedInfluencer(1L);
        // then
        Assertions.assertThat(savedVideos.size()).isEqualTo(3);
    }

    private void setUser() {
        CustomOAuth2User customOAuth2User = new CustomOAuth2User("test", 1L, Role.USER.getRoles());
        Authentication authentication = new UsernamePasswordAuthenticationToken(customOAuth2User,
                null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
