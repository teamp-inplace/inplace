package team7.inplace.place.presentation.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;
import team7.inplace.place.application.dto.PlaceQueryInfo;
import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.review.persistence.dto.ReviewQueryResult;

public class PlacesResponse {
    public record Simple(
            Long placeId,
            String placeName,
            Address address,
            String category,
            String influencerName,
            String menuImgUrl,
            String longitude,
            String latitude,
            Boolean likes
    ) {
        public static List<Simple> from(List<PlaceQueryInfo.Simple> placeInfos) {
            return placeInfos.stream()
                    .map(Simple::from)
                    .toList();
        }

        public static Simple from(PlaceQueryInfo.Simple placeInfo) {
            return new Simple(
                    placeInfo.place().placeId(),
                    placeInfo.place().placeName(),
                    Address.from(
                            placeInfo.place().address1(),
                            placeInfo.place().address2(),
                            placeInfo.place().address3()
                    ),
                    placeInfo.place().category(),
                    placeInfo.video().get(0).influencerName(), //TODO : 인플루언서가 여러명일 경우 처리 필요
                    placeInfo.place().menuImgUrl(),
                    placeInfo.place().longitude().toString(),
                    placeInfo.place().latitude().toString(),
                    placeInfo.place().isLiked()
            );
        }
    }

    public record Detail(
            Long placeId,
            String placeName,
            Address address,
            String category,
            String influencerName,
            String longitude,
            String latitude,
            Boolean likes,
            JsonNode facilityInfo,
            PlacesResponse.MenuInfos menuInfos,
            PlacesResponse.OpenHour openHour,
            PlacesResponse.PlaceLikes placeLikes,
            String videoUrl
    ) {
        public static Detail from(PlaceQueryInfo.Detail placeDetailInfo) {
            var placeBulk = placeDetailInfo.placeBulk();
            var videos = placeDetailInfo.videos();
            var placeReviewLikeRate = placeDetailInfo.reviewLikeRate();

            var menuInfos = PlacesResponse.MenuInfos.from(
                    placeBulk.menuBordPhotos(),
                    placeBulk.menus(),
                    placeBulk.detailedPlace().menuUpdatedAt()
            );
            var openHour = PlacesResponse.OpenHour.from(placeBulk.openTimes(), placeBulk.offDays());
            var placeLikes = PlacesResponse.PlaceLikes.from(placeReviewLikeRate);

            return new Detail(
                    placeBulk.detailedPlace().placeId(),
                    placeBulk.detailedPlace().placeName(),
                    Address.from(
                            placeBulk.detailedPlace().address1(),
                            placeBulk.detailedPlace().address2(),
                            placeBulk.detailedPlace().address3()
                    ),
                    placeBulk.detailedPlace().category(),
                    videos.get(0).influencerName(), //TODO : 인플루언서가 여러명일 경우 처리 필요
                    placeBulk.detailedPlace().longitude().toString(),
                    placeBulk.detailedPlace().latitude().toString(),
                    placeBulk.detailedPlace().isLiked(),
                    facilityTree(placeBulk.detailedPlace().facility()),
                    menuInfos,
                    openHour,
                    placeLikes,
                    videos.get(0).videoUUID()
            );
        }

        private static JsonNode facilityTree(String facility) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                return objectMapper.readTree(facility);
            } catch (Exception e) {
                var noDataNode = objectMapper.createObjectNode();
                noDataNode.put("message", "");
                return noDataNode;
            }
        }
    }

    public record Address(
            String address1,
            String address2,
            String address3
    ) {
        public static Address from(String address1, String address2, String address3) {
            return new Address(address1, address2, address3);
        }
    }

    public record MenuInfos(
            List<String> menuImgUrls,
            List<Menu> menuList,
            LocalDateTime menuUpdatedAt
    ) {
        public static MenuInfos from(
                List<PlaceQueryResult.MenuBordPhoto> menuBoardPhotos,
                List<PlaceQueryResult.Menu> menus,
                LocalDateTime menuUpdatedAt
        ) {
            return new MenuInfos(
                    menuBoardPhotos.stream().map(PlaceQueryResult.MenuBordPhoto::imgUrl).toList(),
                    menus.stream().map(PlacesResponse.Menu::from).toList(),
                    menuUpdatedAt
            );
        }
    }

    public record Menu(
            String menuName,
            String price,
            String menuImgUrl,
            Boolean recommended,
            String description
    ) {
        public static Menu from(PlaceQueryResult.Menu menu) {
            return new Menu(
                    menu.name(),
                    menu.price(),
                    menu.imgUrl(),
                    menu.recommend(),
                    menu.description()
            );
        }
    }

    public record OpenHour(
            List<OpenTime> periodList,
            List<OffDay> offdayList
    ) {
        public static OpenHour from(
                List<PlaceQueryResult.OpenTime> openTimes,
                List<PlaceQueryResult.OffDay> closeTimes
        ) {
            return new OpenHour(
                    openTimes.stream().map(OpenTime::from).toList(),
                    closeTimes.stream().map(OffDay::from).toList()
            );
        }
    }

    public record OpenTime(
            String timeName,
            String timeSE,
            String dayOfWeek
    ) {
        public static OpenTime from(PlaceQueryResult.OpenTime openTime) {
            return new OpenTime(
                    openTime.timeName(),
                    openTime.timeSE(),
                    openTime.dayOfWeek()
            );
        }
    }

    public record OffDay(
            String holidayName,
            String weekAndDay,
            String temporaryHolidays
    ) {
        public static OffDay from(PlaceQueryResult.OffDay offDay) {
            return new OffDay(
                    offDay.holidayName(),
                    offDay.weekAndDay(),
                    offDay.temporaryHolidays()
            );
        }
    }

    public record PlaceLikes(
            String like,
            String dislike
    ) {
        public static PlaceLikes from(ReviewQueryResult.LikeRate likeRate) {
            return new PlaceLikes(likeRate.likes().toString(), likeRate.dislikes().toString());
        }
    }
}
