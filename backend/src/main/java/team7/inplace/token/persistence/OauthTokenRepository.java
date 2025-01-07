package team7.inplace.token.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team7.inplace.token.domain.OauthToken;

import java.util.Optional;

@Repository
public interface OauthTokenRepository extends JpaRepository<OauthToken, Long> {

    Optional<OauthToken> findByUserId(Long userId);
}
