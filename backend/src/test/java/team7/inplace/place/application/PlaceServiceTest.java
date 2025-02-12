package team7.inplace.place.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import team7.inplace.global.baseEntity.BaseEntity;
import team7.inplace.liked.likedPlace.persistence.LikedPlaceRepository;
import team7.inplace.place.application.command.PlacesCommand;
import team7.inplace.place.domain.Place;
import team7.inplace.place.persistence.PlaceJpaRepository;
import team7.inplace.place.persistence.PlaceReadRepository;
import team7.inplace.review.persistence.ReviewJPARepository;
import team7.inplace.video.persistence.VideoReadRepository;

@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock
    private PlaceReadRepository placeReadRepository;
    @Mock
    private PlaceSaveRepository placeSaveRepository;
    @Mock
    private PlaceJpaRepository placeJpaRepository;
    @Mock
    private ReviewJPARepository reviewJPARepository;
    @Mock
    private LikedPlaceRepository likedPlaceRepository;
    @Mock
    private VideoReadRepository videoReadRepository;

    @InjectMocks
    private PlaceService placeService;

    @Test
    @DisplayName("이미 이름이 있는 경우 새로운 장소를 등록하지 않는 테스트")
    void placeSaveTest_existPlace() throws NoSuchFieldException, IllegalAccessException {
        // given
        var placeCommand = new PlacesCommand.Create(
            "name",
            "category",
            "address",
            "CHINESE",
            "address address address",
            "1.0",
            "1.0",
            null,
            null,
            null,
            null,
            null
        );
        var existPlace = new Place(
            "name",
            "category",
            "address",
            "CHINESE",
            "address address address",
            "1.0",
            "1.0",
            null
        );
        final Long id = 1L;

        Field idField = BaseEntity.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(existPlace, 1L);
        // when
        when(placeJpaRepository.findPlaceByName(placeCommand.placeName()))
            .thenReturn(Optional.of(existPlace));
        // then
        assertThat(placeService.createPlace(placeCommand))
            .isEqualTo(id);
    }

    @Test
    @DisplayName("새로운 장소를 등록하는 테스트")
    void placeSaveTest_newPlace() {
        // given
        var placeCommand = new PlacesCommand.Create(
            "name",
            "category",
            "address",
            "CHINESE",
            "address address address",
            "1.0",
            "1.0",
            new ArrayList<>(),
            new ArrayList<>(),
            new ArrayList<>(),
            null,
            new ArrayList<>()
        );
        final Long id = 1L;
        // when
        when(placeJpaRepository.findPlaceByName(placeCommand.placeName()))
            .thenReturn(Optional.empty());
        when(placeSaveRepository.save(any()))
            .thenReturn(id);
        // then
        assertThat(placeService.createPlace(placeCommand))
            .isEqualTo(id);
    }

}