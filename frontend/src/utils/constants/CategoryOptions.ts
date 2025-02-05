export const categoryMapping = {
  RESTAURANT: '음식점',
  CAFE: '카페',
  JAPANESE: '일식',
  KOREAN: '한식',
  WESTERN: '양식',
  CHINESE: '중식',
  CHICKEN: '치킨',
  VIETNAMESE: '베트남식',
  THAI: '태국식',
  INDIAN: '인도식',
} as const;

export const categoryOptions = Object.keys(categoryMapping).map((key) => ({
  label: key,
}));
