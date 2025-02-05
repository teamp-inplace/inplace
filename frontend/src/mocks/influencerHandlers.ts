import { rest } from 'msw';
import { BASE_URL } from '@/api/instance';
import { getInfluencerPath } from '@/api/hooks/useGetMain';
import { getInfluencerInfoPath } from '@/api/hooks/useGetInfluencerInfo';
import { getInfluencerVideoPath } from '@/api/hooks/useGetInfluencerVideo';

const mockVideos = [
  {
    videoId: 1,
    videoAlias: '정육왕 (이)가 추천하는 맛집! 다양한 메뉴를 즐길 수 있습니다.',
    videoUrl: 'https://youtu.be/qbqquv_8wM0?si=j7LiU5DSfTVpKa1I',
    place: {
      placeId: 1,
      placeName: '이선장네',
    },
  },
  {
    videoId: 2,
    videoAlias: '풍자가 기절한 바로 그곳',
    videoUrl: 'https://youtu.be/g5P0vpGSbng?si=RB71ZAx12kDas9a6',
    place: {
      placeId: 2,
      placeName: '풍자또가',
    },
  },
  {
    videoId: 3,
    videoAlias: '히밥이 다 못먹은 가성비 그곳',
    videoUrl: 'https://youtu.be/cz1EvePzqfM?si=L5ZsKV4DXikGIuEP',
    place: {
      placeId: 3,
      placeName: '가성비집',
    },
  },
  {
    videoId: 7,
    videoAlias: '풍자가 기절한 바로 그곳',
    videoUrl: 'https://youtu.be/g5P0vpGSbng?si=RB71ZAx12kDas9a6',
    place: {
      placeId: 7,
      placeName: '풍자또가',
    },
  },
  {
    videoId: 4,
    videoAlias: '히밥이 다 못먹은 가성비 그곳',
    videoUrl: 'https://youtu.be/cz1EvePzqfM?si=L5ZsKV4DXikGIuEP',
    place: {
      placeId: 4,
      placeName: '가성비집',
    },
  },
  {
    videoId: 5,
    videoAlias: '풍자가 기절한 바로 그곳',
    videoUrl: 'https://youtu.be/g5P0vpGSbng?si=RB71ZAx12kDas9a6',
    place: {
      placeId: 5,
      placeName: '풍자또가',
    },
  },
  {
    videoId: 6,
    videoAlias: '히밥이 다 못먹은 가성비 그곳',
    videoUrl: 'https://youtu.be/cz1EvePzqfM?si=L5ZsKV4DXikGIuEP',
    place: {
      placeId: 6,
      placeName: '가성비집',
    },
  },
];
const mockInfluencers = [
  {
    influencerId: 1,
    influencerName: '성시경',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '모델',
    likes: true,
  },
  {
    influencerId: 2,
    influencerName: '풍자',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '배우',
    likes: false,
  },
  {
    influencerId: 3,
    influencerName: '아이유',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '가수',
    likes: false,
  },
  {
    influencerId: 4,
    influencerName: '이영자',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '방송인',
    likes: false,
  },
  {
    influencerId: 5,
    influencerName: '정해인',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '배우',
    likes: false,
  },
  {
    influencerId: 6,
    influencerName: '황정민',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '배우',
    likes: false,
  },
  {
    influencerId: 7,
    influencerName: '히밥',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '유튜버',
    likes: false,
  },
  {
    influencerId: 8,
    influencerName: '백종원',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '유튜버',
    likes: true,
  },
  {
    influencerId: 9,
    influencerName: '안성재',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '셰프',
    likes: false,
  },
  {
    influencerId: 10,
    influencerName: '임영웅',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '배우',
    likes: false,
  },
  {
    influencerId: 11,
    influencerName: '짱구 대디',
    influencerImgUrl: 'https://via.placeholder.com/100',
    influencerJob: '패션 유튜버',
    likes: false,
  },
];

export const InfluencerHandlers = [
  rest.get(`${BASE_URL}${getInfluencerPath()}`, (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') ?? '0', 10);
    const size = parseInt(url.searchParams.get('size') ?? '10', 10);

    const totalElements = mockInfluencers.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = Math.min(startIndex + size, totalElements);
    const paginatedContent = mockInfluencers.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        totalPages,
        totalElements,
        size,
        content: paginatedContent,
        number: page,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        numberOfElements: paginatedContent.length,
        pageable: {
          offset: page * size,
          sort: {
            empty: true,
            sorted: true,
            unsorted: true,
          },
          paged: true,
          pageNumber: page,
          pageSize: size,
          unpaged: false,
        },
        first: page === 0,
        last: page === totalPages - 1,
        empty: paginatedContent.length === 0,
      }),
    );
  }),
  rest.get(`${BASE_URL}${getInfluencerInfoPath('1')}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        influencerId: 1,
        influencerName: '성시경',
        influencerImgUrl: '',
        influencerJob: '가수',
        likes: false,
        follower: 200,
        placeCount: 200,
      }),
    );
  }),
  rest.get(`${BASE_URL}${getInfluencerVideoPath('1')}`, (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') ?? '0', 10);
    const size = parseInt(url.searchParams.get('size') ?? '10', 10);

    const totalElements = mockVideos.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = Math.min(startIndex + size, totalElements);
    const paginatedContent = mockVideos.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        totalPages,
        totalElements,
        size,
        content: paginatedContent,
        number: page,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        numberOfElements: paginatedContent.length,
        pageable: {
          offset: page * size,
          sort: {
            empty: true,
            sorted: true,
            unsorted: true,
          },
          paged: true,
          pageNumber: page,
          pageSize: size,
          unpaged: false,
        },
        first: page === 0,
        last: page === totalPages - 1,
        empty: paginatedContent.length === 0,
      }),
    );
  }),
];

export default InfluencerHandlers;
