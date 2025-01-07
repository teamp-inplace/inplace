package team7.inplace.place.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import team7.inplace.place.domain.PlaceBulk;

public interface PlaceCustomRepository {
    Optional<PlaceBulk> findPlaceById(Long id);

    Page<PlaceBulk> findPlacesByDistance(
            @Param("longitude") String longitude,
            @Param("latitude") String latitude,
            Pageable pageable
    );

    Page<PlaceBulk> findPlacesByDistanceAndFilters(
            @Param("topLeftLongitude") String topLeftLongitude,
            @Param("topLeftLatitude") String topLeftLatitude,
            @Param("bottomRightLongitude") String bottomRightLongitude,
            @Param("bottomRightLatitude") String bottomRightLatitude,
            @Param("longitude") String longitude,
            @Param("latitude") String latitude,
            @Param("categories") List<String> categories,
            @Param("influencers") List<String> influencers,
            Pageable pageable
    );

}
