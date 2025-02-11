import { rest } from 'msw';
import { BASE_URL } from '@/api/instance';
import { getPlaceInfoPath } from '@/api/hooks/useGetPlaceInfo';
import { getReviewPath } from '@/api/hooks/useGetReview';
import { getSendInfoPath } from '@/api/hooks/useGetSendInfo';
import BasicImage from '@/assets/images/basic-image.webp';

let reviews = [
  {
    reviewId: 1,
    likes: true,
    comment: '정말 좋았어요! 다음에 또 오고 싶습니다',
    userNickname: '사용자1',
    createdDate: new Date('2024-10-01T12:00:00Z'),
    mine: true,
  },
  {
    reviewId: 2,
    likes: false,
    comment: '별로였어요. 개선이 필요합니다.',
    userNickname: '사용자2',
    createdDate: new Date('2024-10-02T15:30:00Z'),
    mine: false,
  },
  {
    reviewId: 3,
    likes: true,
    comment: '맛있고 분위기도 좋았습니다',
    userNickname: '사용자3',
    createdDate: new Date('2024-10-03T09:15:00Z'),
    mine: false,
  },
  {
    reviewId: 4,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자4',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 5,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자5',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 6,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자6',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 7,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자7',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 8,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자8',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 9,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자9',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 10,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자10',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 11,
    likes: false,
    comment: '11번입니다리',
    userNickname: '사용자11',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 12,
    likes: false,
    comment: '12번입니다리',
    userNickname: '사용자11',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 13,
    likes: false,
    comment: '11번입니다리',
    userNickname: '사용자11',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
  {
    reviewId: 14,
    likes: false,
    comment: '11번입니다리',
    userNickname: '사용자11',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
];
export const detailHandlers = [
  rest.get(`${BASE_URL}${getPlaceInfoPath('1')}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        placeId: 1,
        placeName: '료코',
        address: {
          address1: '대구',
          address2: '북구',
          address3: '대학로',
        },
        videos: [
          {
            influencerName: '성시경',
            videoUrl: 'https://www.youtube.com/watch?v=nCEtQ7dP8zY',
          },
          {
            influencerName: '',
            videoUrl: BasicImage,
          },
        ],
        category: '맛집',
        longitude: '126.570667',
        latitude: '33.450701',
        facility: {
          acceptsCreditCards: false,
          acceptsCashOnly: false,
          freeParkingLot: false,
          paidParkingLot: true,
          wheelchairAccessibleSeating: true,
        },
        rating: 2.5,
        googleUrl: 'https://google.com',
        googleReviews: [
          {
            like: true,
            text: '정말 좋았어요! 다음에 또 오고 싶습니다정말 좋았어요! 다음에 또 오고 싶습니',
            name: '효은',
            publishTime: new Date('2024-10-03T11:45:00Z'),
          },
          {
            like: false,
            text: '정말 좋았어요! 다음에 또 오고 싶습니다정말',
            name: '효f은',
            publishTime: new Date('2024-10-03T11:45:00Z'),
          },
          {
            like: true,
            text: '맛잇었어요',
            name: '효a은',
            publishTime: new Date('2024-10-03T11:45:00Z'),
          },
          {
            like: true,
            text: '정말 좋았어요! 다음에 또 니다정말 좋았어요! 다음에 또 오고 싶습니다정말 좋았어요! 다음에 또 오고 싶습니다',
            name: '효q은',
            publishTime: new Date('2024-10-03T11:45:00Z'),
          },
          {
            like: false,
            text: '별롭니다',
            name: '효b은',
            publishTime: new Date('2024-10-03T11:45:00Z'),
          },
        ],
        openHour: [
          {
            timeName: '월~금 10:00 - 12:00',
          },
          {
            timeName: '월~금 10:00 - 12:00',
          },
          {
            timeName: '월~금 10:00 - 12:00',
          },
        ],
        placeLikes: {
          like: 240,
          dislike: 100,
        },
      }),
    );
  }),
  rest.get(`${BASE_URL}${getReviewPath('1')}`, (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') ?? '0', 10);
    const size = parseInt(url.searchParams.get('size') ?? '10', 10);

    const totalElements = reviews.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = Math.min(startIndex + size, totalElements);
    const paginatedContent = reviews.slice(startIndex, endIndex);

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
  rest.delete(`${BASE_URL}/reviews/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const normalizedId = id instanceof Array ? id[0] : id;
    reviews = reviews.filter((review) => review.reviewId !== parseInt(normalizedId, 10));
    return res(ctx.status(200), ctx.json({ message: '리뷰가 삭제되었습니다.' }));
  }),
  rest.get(`${BASE_URL}${getSendInfoPath('1')}`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: '완료되었습니다.' }));
  }),
];
export default detailHandlers;
