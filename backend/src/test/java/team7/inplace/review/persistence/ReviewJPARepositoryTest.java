package team7.inplace.review.persistence;


import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import team7.inplace.place.domain.Place;
import team7.inplace.review.domain.Review;
import team7.inplace.user.domain.Role;
import team7.inplace.user.domain.User;
import team7.inplace.user.domain.UserType;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ReviewJPARepositoryTest {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    private ReviewJPARepository reviewJPARepository;

    @BeforeEach
    void init() {
        Place place1 = new Place("Place 1",
                "\"wifi\": true, \"pet\": false, \"parking\": false, \"forDisabled\": true, \"nursery\": false, \"smokingRoom\": false}",
                "menuImg.url", "카페",
                "Address 1|Address 2|Address 3",
                "10.0", "10.0",
                LocalDateTime.of(2024, 3, 28, 5, 30)
        );

        entityManager.persist(place1);

        User user1 = new User("user1", "pass1", "nick1", UserType.KAKAO, Role.USER);
        User user2 = new User("user2", "pass1", "nick1", UserType.KAKAO, Role.USER);
        User user3 = new User("user3", "pass1", "nick1", UserType.KAKAO, Role.USER);
        User user4 = new User("user4", "pass1", "nick1", UserType.KAKAO, Role.USER);

        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.persist(user3);
        entityManager.persist(user4);

        Review review1 = new Review(user1, place1, true, "comment1");
        Review review2 = new Review(user2, place1, true, "comment2");
        Review review3 = new Review(user3, place1, false, "comment3");
        Review review4 = new Review(user4, place1, true, "comment4");

        entityManager.persist(review1);
        entityManager.persist(review2);
        entityManager.persist(review3);
        entityManager.persist(review4);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    @DisplayName("like true false test")
    public void checkLikedDisliked() {
        //given
        //when
        int likes = reviewJPARepository.countByPlaceIdAndIsLikedTrue(
                1L);

        int dislikes = reviewJPARepository.countByPlaceIdAndIsLikedFalse(
                1L);

        //then
        assertThat(likes).isEqualTo(3);
        assertThat(dislikes).isEqualTo(1);
    }
}
