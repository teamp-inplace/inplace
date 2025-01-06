package team7.inplace.place.application.dto;


import team7.inplace.place.domain.Address;
import team7.inplace.place.domain.PlaceBulk;

public record PlaceInfo(
        Long placeId,
        String placeName,
        AddressInfo address,
        String category,
        String influencerName,
        String menuImgUrl,
        String longitude,
        String latitude,
        Boolean likes
) {


    public static PlaceInfo of(PlaceBulk place, String influencerName, boolean likes) {
        return new PlaceInfo(
                place.getPlace().getId(),
                place.getPlace().getName(),
                AddressInfo.of(place.getPlace().getAddress()),
                place.getPlace().getCategory().toString(),
                influencerName,
                place.getPlace().getMenuImgUrl(),
                place.getPlace().getCoordinate().getLongitude().toString(),
                place.getPlace().getCoordinate().getLatitude().toString(),
                likes
        );
    }

    // influencer, likes 추가 예정
    public record AddressInfo(
            String address1,
            String address2,
            String address3
    ) {

        public static AddressInfo of(Address address) {
            return new PlaceInfo.AddressInfo(
                    address.getAddress1(),
                    address.getAddress2(),
                    address.getAddress3()
            );
        }
    }
}
