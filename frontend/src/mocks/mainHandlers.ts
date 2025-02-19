import { rest } from 'msw';
import { getBannerPath, getInfluencerPath } from '@/api/hooks/useGetMain';
import { BASE_URL } from '@/api/instance';
import { getMyInfluencerVideoPath } from '@/api/hooks/useGetMyInfluencerVideo';
import { getAroundVideoPath } from '@/api/hooks/useGetAroundVideo';
import { getCoolVideoPath, getNewVideoPath } from '@/api/hooks/useGetLogoutVideo';
import BannerImg from '@/assets/images/bannerImg.webp';
import Back from '@/assets/images/back-card.webp';
import Basic from '@/assets/images/basic-image.webp';
import BannerMob from '@/assets/images/mobile_banner.webp';

export const mainHandlers = [
  rest.get(`${BASE_URL}${getBannerPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          imageUrl: BannerImg,
          influencerId: null,
          isMain: true,
          isMobile: false,
        },
        {
          id: 2,
          imageUrl: BannerMob,
          influencerId: null,
          isMain: true,
          isMobile: true,
        },
        {
          id: 3,
          imageUrl: Basic,
          influencerId: 1,
          isMain: false,
          isMobile: false,
        },
        {
          id: 4,
          imageUrl: Back,
          influencerId: 2,
          isMain: false,
          isMobile: false,
        },
        {
          id: 5,
          imageUrl: Basic,
          influencerId: 3,
          isMain: false,
          isMobile: false,
        },
      ]),
    );
  }),
  rest.get(`${BASE_URL}${getCoolVideoPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
            placeId: 2,
            placeName: '풍자또가',
          },
        },
        {
          videoId: 4,
          videoAlias: '히밥이 다 못먹은 가성비 그곳',
          videoUrl: 'https://youtu.be/cz1EvePzqfM?si=L5ZsKV4DXikGIuEP',
          place: {
            placeId: 3,
            placeName: '가성비집',
          },
        },
        {
          videoId: 5,
          videoAlias: '풍자가 기절한 바로 그곳',
          videoUrl: 'https://youtu.be/g5P0vpGSbng?si=RB71ZAx12kDas9a6',
          place: {
            placeId: 2,
            placeName: '풍자또가',
          },
        },
        {
          videoId: 6,
          videoAlias: '히밥이 다 못먹은 가성비 그곳',
          videoUrl: 'https://youtu.be/cz1EvePzqfM?si=L5ZsKV4DXikGIuEP',
          place: {
            placeId: 3,
            placeName: '가성비집',
          },
        },
      ]),
    );
  }),
  rest.get(`${BASE_URL}${getNewVideoPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
      ]),
    );
  }),
  rest.get(`${BASE_URL}${getMyInfluencerVideoPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          videoId: 1,
          videoAlias: '성시경이 갔다가 못 돌아온 바로 그곳',
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
      ]),
    );
  }),
  rest.get(`${BASE_URL}${getAroundVideoPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          videoId: 1,
          videoAlias: '성시경이 갔다가 못 돌아온 바로 그곳',
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
      ]),
    );
  }),
  rest.get(`${BASE_URL}${getInfluencerPath()}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalPages: 0,
        totalElements: 0,
        size: 0,
        content: [
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
        ],
        number: 0,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        numberOfElements: 0,
        pageable: {
          offset: 0,
          sort: {
            empty: true,
            sorted: true,
            unsorted: true,
          },
          paged: true,
          pageNumber: 0,
          pageSize: 0,
          unpaged: true,
        },
        first: true,
        last: true,
        empty: true,
      }),
    );
  }),
  rest.post(`${BASE_URL}/influencers/likes`, (req, res, ctx) => {
    const { influencerId, likes } = req.body as { influencerId: string; likes: boolean };
    return res(
      ctx.status(200),
      ctx.json({
        influencerId,
        likes,
      }),
    );
  }),
];
export default mainHandlers;
