import { rest } from 'msw';
import { BASE_URL } from '@/api/instance';
import { getPlaceInfoPath } from '@/api/hooks/useGetPlaceInfo';
import { getReviewPath } from '@/api/hooks/useGetReview';
import { getSendInfoPath } from '@/api/hooks/useGetSendInfo';
import BasicImage from '@/assets/images/basic-image.png';

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
        category: '맛집',
        influencerName: '성시경',
        longitude: '126.570667',
        latitude: '33.450701',
        likes: true,
        facilityInfo: {
          wifi: 'Y',
          pet: 'Y',
          parking: 'Y',
          forDisabled: 'Y',
          nursery: 'Y',
          smokingRoom: 'Y',
        },
        menuInfos: {
          menuImgUrls: [BasicImage, 'https://via.placeholder.com/600', 'https://via.placeholder.com/700'],
          menuList: [
            {
              price: '14,000',
              recommend: true,
              menuName: '료코카츠',
              menuImgUrl: BasicImage,
              description: '료코만의 감성을 담은',
            },
            {
              price: '3,000',
              recommend: false,
              menuName: '료코츠카',
              menuImgUrl: 'https://via.placeholder.com/100',
              description: '료코만의 감성을 담은',
            },
            {
              price: '14,000',
              recommend: false,
              menuName: '료고카츠',
              menuImgUrl: 'https://via.placeholder.com/100',
              description: '국내산 돼지 안심을 료코만의 방식으로 숙성 및 조리하여 육즙과 부드러움의 특징을 살린 메뉴',
            },
            {
              price: '3,020',
              recommend: false,
              menuName: '리조또',
              menuImgUrl: '',
              description: '국내산 돼지 안심을 료코만의 방식으로 숙성 및 조리하여 육즙과 부드러움의 특징을 살린 메뉴',
            },
          ],
          timeExp: new Date('2024-10-01T12:00:00Z'),
        },
        openHour: {
          periodList: [
            {
              timeName: '영업시간',
              timeSE: '10:00 ~ 20:00',
              dayOfWeek: '매일',
            },
            {
              timeName: '휴게시간',
              timeSE: '10:00 - 12:00',
              dayOfWeek: '월~금',
            },
            {
              timeName: '라스트오더',
              timeSE: '- 12:00',
              dayOfWeek: '월~금',
            },
            {
              timeName: '휴게시간',
              timeSE: '13:10 - 13:40',
              dayOfWeek: '토, 일',
            },
            {
              timeName: '라스트오더',
              timeSE: '- 11:20',
              dayOfWeek: '토, 일',
            },
          ],
          offdayList: [
            {
              holidayName: '휴무일',
              weekAndDay: '토',
              temporaryHolidays: 'Y',
            },
          ],
        },
        placeLikes: {
          like: 240,
          dislike: 100,
        },
        videoUrl: [
          'https://youtu.be/qbqquv_8wM0?si=j7LiU5DSfTVpKa1I',
          'https://www.youtube.com/watch?v=nCEtQ7dP8zY',
          '',
        ],
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
    const normalizedId = Array.isArray(id) ? id[0] : id;
    reviews = reviews.filter((review) => review.reviewId !== parseInt(normalizedId, 10));
    return res(ctx.status(200), ctx.json({ message: '리뷰가 삭제되었습니다.' }));
  }),
  rest.get(`${BASE_URL}${getSendInfoPath('1')}`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: '완료되었습니다.' }));
  }),
];
export default detailHandlers;
