package team7.inplace.search.persistence;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import team7.inplace.influencer.domain.QInfluencer;
import team7.inplace.search.application.dto.AutoCompletionInfo;

@Repository
@RequiredArgsConstructor
public class InfluencerSearchRepository implements SearchRepository {
    private final JPAQueryFactory queryFactory;

    public List<AutoCompletionInfo> searchSimilarKeywords(String keyword) {
        NumberTemplate<Double> matchScore = Expressions.numberTemplate(
                Double.class,
                "function('match_against', {0}, {1})",
                QInfluencer.influencer.name,
                keyword
        );

        return queryFactory
                .select(Projections.constructor(AutoCompletionInfo.class,
                        QInfluencer.influencer.name,
                        matchScore.as("score")
                ))
                .from(QInfluencer.influencer)
                .where(matchScore.gt(0))
                .orderBy(matchScore.desc())
                .limit(AUTO_COMPLETION_LIMIT)
                .fetch();
    }
}
