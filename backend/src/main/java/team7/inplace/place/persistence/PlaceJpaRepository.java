package team7.inplace.place.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import team7.inplace.place.domain.Place;

public interface PlaceJpaRepository extends JpaRepository<Place, Long> {

    Optional<Place> findPlaceByKakaoPlaceId(Long placeId);
}
