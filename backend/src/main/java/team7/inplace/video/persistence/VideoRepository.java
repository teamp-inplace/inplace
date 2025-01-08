package team7.inplace.video.persistence;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import team7.inplace.video.domain.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {

//    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer ORDER BY v.view.viewCountIncrease DESC")
//    List<Video> findTop10ByOrderByViewCountIncreaseDesc(Pageable pageable);

//    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer WHERE v.influencer.id IN :influencerIds ORDER BY v.id DESC")
//    List<Video> findTop10ByInfluencerIdIn(@Param("influencerIds") List<Long> influencerIds, Pageable pageable);

//    @Query("SELECT v FROM Video v JOIN FETCH v.place JOIN FETCH v.influencer ORDER BY v.id DESC")
//    List<Video> findTop10ByOrderByIdDesc(Pageable pageable);

//    Optional<Video> findTopByPlaceOrderByIdDesc(Place place);

    @Query(
            value = "SELECT v FROM Video v WHERE v.placeId IS NULL",
            countQuery = "SELECT COUNT(v) FROM Video v"
    )
    Page<Video> findAllByPlaceIsNull(Pageable pageable);

    List<Video> findByPlaceIdIn(List<Long> placeIds);

    List<Video> findByPlaceId(Long placeId);

    @Query("SELECT v FROM Video v  WHERE v.placeId IN :placeIds")
    List<Video> findByPlaceIdInWithInfluencer(List<Long> placeIds);
}
