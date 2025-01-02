package team7.inplace.video.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team7.inplace.place.domain.Place;
import team7.inplace.video.domain.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer ORDER BY v.view.viewCountIncrease DESC")
    List<Video> findTop10ByOrderByViewCountIncreaseDesc(Pageable pageable);

    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer WHERE v.influencer.id IN :influencerIds ORDER BY v.id DESC")
    List<Video> findTop10ByInfluencerIdIn(@Param("influencerIds") List<Long> influencerIds, Pageable pageable);

    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer ORDER BY v.id DESC")
    List<Video> findTop10ByOrderByIdDesc(Pageable pageable);

    Optional<Video> findTopByPlaceOrderByIdDesc(Place place);

    @Query(
            value = "SELECT v FROM Video v JOIN FETCH v.influencer WHERE v.place IS NULL",
            countQuery = "SELECT COUNT(v) FROM Video v"
    )
    Page<Video> findAllByPlaceIsNull(Pageable pageable);

    List<Video> findByPlaceIdIn(List<Long> placeIds);

    List<Video> findByPlaceId(Long placeId);

    @Query("SELECT v FROM Video v JOIN FETCH v.influencer WHERE v.place.id IN :placeIds")
    List<Video> findByPlaceIdInWithInfluencer(List<Long> placeIds);
}
