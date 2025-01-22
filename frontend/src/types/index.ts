export type BannerData = {
  id: number;
  imageUrl: string;
};
export type InfluencerData = {
  influencerId: number;
  influencerName: string;
  influencerImgUrl: string;
  influencerJob: string;
  likes?: boolean;
};

export type SpotData = {
  videoId: number;
  videoAlias: string;
  videoUrl: string;
  place: {
    placeId: number;
    placeName: string;
  };
};
export type PageableData<T> = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type AddressInfo = {
  address1: string;
  address2: string;
  address3: string;
};

export type PlaceData = {
  placeId: number;
  placeName: string;
  address: AddressInfo;
  category: string;
  influencerName: string;
  menuImgUrl: string;
  longitude: string;
  latitude: string;
  likes: boolean;
};

export type LocationData = {
  topLeftLongitude: number;
  topLeftLatitude: number;
  bottomRightLongitude: number;
  bottomRightLatitude: number;
};

export type FilterParams = {
  categories: string[];
  influencers: string[];
};

export type PlaceList = {
  places: PlaceData[];
};

export type PlaceInfo = {
  placeId: number;
  placeName: string;
  address: AddressInfo;
  category: string;
  influencerName: string;
  longitude: string;
  latitude: string;
  likes: boolean;
  facilityInfo: FacilityInfo;
  menuInfos: {
    menuImgUrls: string[];
    menuList: Menu[];
    timeExp: Date;
  };
  openHour: OpenHourData;
  placeLikes: PlaceLikes;
  videoUrl: [string];
};

export type PlaceLikes = {
  like: number;
  dislike: number;
};

export type FacilityInfo = {
  wifi?: string;
  pet?: string;
  parking?: string;
  forDisabled?: string;
  nursery?: string;
  smokingRoom?: string;
  message?: string;
};

export type Menu = {
  price: string;
  recommend: boolean;
  menuName: string;
  menuImgUrl: string;
  description: string;
};

export type ReviewData = {
  reviewId: number;
  likes: boolean;
  comment: string;
  userNickname: string;
  createdDate: Date;
  mine: boolean;
};

export type OpenHourData = {
  periodList: {
    timeName: string;
    timeSE: string;
    dayOfWeek: string;
  }[];
  offdayList: {
    holidayName: string;
    weekAndDay: string;
    temporaryHolidays: string;
  }[];
};
export type RequestInfluencerLike = {
  influencerId: number;
  likes: boolean;
};
export type UserInfoData = {
  nickname: string;
};
export type UserPlaceData = {
  placeId: number;
  placeName: string;
  imageUrl: string;
  influencer?: string;
  likes: boolean;
};
export type RequestPlaceLike = {
  placeId: number;
  likes: boolean;
};
export type UserReviewData = {
  reviewId: number;
  place: {
    placeId: number;
    placeName: string;
    imgUrl: string;
    address: {
      address1: string;
      address2: string;
      address3: string;
    };
  };
  likes: boolean;
  comment: string;
  createdDate: Date;
};
export type RequestPlaceReview = {
  likes: boolean | null;
  comments: string;
};

export type MultipleLikeRequest = {
  influencerIds: number[];
  likes: boolean;
};

export type SearchComplete = {
  result: string;
  score: number;
  searchType: string;
};
export type InfluencerInfoData = {
  influencerId: number;
  influencerName: string;
  influencerImgUrl: string;
  influencerJob: string;
  likes: boolean;
  follower: number;
  placeCount: number;
};
export type MarkerData = {
  placeId: number;
  longitude: number;
  latitude: number;
};
export type MarkerInfo = {
  placeId: number;
  placeName: string;
  category: string;
  influencerName: string;
  address: AddressInfo;
  menuImgUrl: string;
};

export interface ReviewInfo {
  placeName: string;
  placeAddress: string;
  placeImgUrl: string;
  influencerName: string;
  userNickname: string;
}
