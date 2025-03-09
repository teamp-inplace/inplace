package team7.inplace.video.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import team7.inplace.video.domain.CoolVideo;

public interface CoolVideoRepository extends JpaRepository<CoolVideo, Long> {
}
