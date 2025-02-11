package team7.inplace.review.persistence;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import team7.inplace.review.persistence.dto.ReviewQueryResult;

@DataJpaTest
@ActiveProfiles("test")
@Sql("/sql/test-review.sql")
public class ReviewReadRepositoryImplTest {
    @Autowired
    private TestEntityManager testEntityManager;

    private ReviewReadRepository reviewReadRepository;

    @BeforeEach
    void setUp() {
        JPAQueryFactory queryFactory = new JPAQueryFactory(testEntityManager.getEntityManager());
        this.reviewReadRepository = new ReviewReadRepositoryImpl(queryFactory);
    }

    @Test
    @DisplayName("내가 작성한 리뷰 조회 테스트")
    void findDetailedReviewByUserId_ReturnsReviews() {
        // given
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        // when
        Page<ReviewQueryResult.Detail> reviews = reviewReadRepository.findDetailedReviewByUserId(userId, pageable);

        // then
        assertThat(reviews.getContent())
            .hasSize(2)
            .extracting("comment", "placeId")
            .containsExactly(
                tuple("1->1 like", 1L),
                tuple("1->2 like", 2L)
            );
    }

    @Test
    @DisplayName("장소별 리뷰 조회 테스트")
    void findSimpleReviewByUserIdAndPlaceId_ReturnsReviews() {
        // given
        Long userId = 1L;
        Long placeId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        // when
        Page<ReviewQueryResult.Simple> reviews = reviewReadRepository.findSimpleReviewByUserIdAndPlaceId(placeId, userId, pageable);

        // then
        assertThat(reviews.getContent())
            .hasSize(5)
            .extracting("userNickname", "reviewId")
            .containsExactly(
                tuple("user1", 1L),
                tuple("user2", 2L),
                tuple("user3", 3L),
                tuple("user4", 4L),
                tuple("user5", 5L)
            );
    }

    @Test
    @DisplayName("좋아요/싫어요 개수 테스트- 2/3, 5/0")
    void countRateByPlaceId() {
        // given
        Long placeId1 = 1L;
        Long placeId2 = 2L;

        // when
        ReviewQueryResult.LikeRate result1 = reviewReadRepository.countRateByPlaceId(placeId1);
        ReviewQueryResult.LikeRate result2 = reviewReadRepository.countRateByPlaceId(placeId2);
        // Assertions
        assertThat(result1.likes()).isEqualTo(2);
        assertThat(result1.dislikes()).isEqualTo(3);
        assertThat(result2.likes()).isEqualTo(5);
        assertThat(result2.dislikes()).isEqualTo(0);
    }

}
