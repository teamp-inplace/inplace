import DetailPage from '@/pages/Detail';
import { useGetPlaceInfo } from '@/api/hooks/useGetPlaceInfo';
import MainPage from '@/pages/Main';
import { useGetLogoutVideo } from '@/api/hooks/useGetLogoutVideo';
import { testErrorBoundaryBehavior } from '@/utils/test/testUtils';

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock('@/api/hooks/useGetLogoutVideo', () => ({
  useGetLogoutVideo: jest.fn(),
}));

const mockUseGetLogoutVideo = useGetLogoutVideo as jest.Mock;

describe('메인페이지 ErrorBoundary 테스트', () => {
  test('에러 컴포넌트에서 다시 시도 버튼 클릭시 api 재호출되는지 확인', async () => {
    await testErrorBoundaryBehavior({
      renderComponent: () => <MainPage />,
      mockFunction: mockUseGetLogoutVideo,
      mockSuccessData: [
        {
          data: [
            {
              videoId: 1,
              videoAlias: 'Cool Video',
              videoUrl: 'https://youtu.be/qbqquv_8wM0?si=j7LiU5DSfTVpKa1I',
              place: {
                placeId: 1,
                placeName: '이선장네',
              },
            },
          ],
          error: null,
        },
        {
          data: [
            {
              videoId: 2,
              videoAlias: 'New Video',
              videoUrl: 'https://youtu.be/qbqquv_8wM0?si=j7LiU5DSfTVpKa1I',
              place: {
                placeId: 1,
                placeName: '이선장네',
              },
            },
          ],
          error: null,
        },
      ],
    });
  });
});

jest.mock('@/api/hooks/useGetPlaceInfo', () => ({
  useGetPlaceInfo: jest.fn(),
}));

const mockUseGetPlaceInfo = useGetPlaceInfo as jest.Mock;

describe('세부페이지 ErrorBoundary 테스트', () => {
  test('에러 컴포넌트에서 다시 시도 버튼 클릭시 api 재호출되는지 확인', async () => {
    await testErrorBoundaryBehavior({
      renderComponent: () => <DetailPage />,
      mockFunction: mockUseGetPlaceInfo,
      mockSuccessData: {
        data: {
          placeName: 'Test Place',
          placeId: 123,
          videoUrl: ['https://test.video'],
          facilityInfo: {},
          openHour: {
            periodList: [],
            offdayList: [],
          },
          menuInfos: { menuImgUrls: [], menuList: [], menuUpdatedAt: new Date() },
          longitude: '126.978',
          latitude: '37.5665',
          placeLikes: {
            like: 0,
            dislike: 0,
          },
          address: {
            address1: '',
            address2: '',
            address3: '',
          },
          category: '',
          influencerName: '',
          likes: true,
        },
        error: null,
      },
    });
  });
});
