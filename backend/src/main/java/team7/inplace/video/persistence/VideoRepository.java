package team7.inplace.video.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import team7.inplace.video.domain.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query(
        value = "SELECT v FROM Video v WHERE v.placeId IS NULL",
        countQuery = "SELECT COUNT(v) FROM Video v"
    )
    Page<Video> findAllByPlaceIsNull(Pageable pageable);

    Boolean existsByUuid(String uuid);
}
