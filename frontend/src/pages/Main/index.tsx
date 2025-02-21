import styled from 'styled-components';
import { useEffect } from 'react';
import BaseLayout from '@/components/common/BaseLayout';
import MainBanner from '@/components/Main/MainBanner';
import ResearchModal from '@/components/common/modals/ResearchModal';

import { useGetMain } from '@/api/hooks/useGetMain';
import SearchBar from '@/components/common/SearchBar';
import useAuth from '@/hooks/useAuth';
import { useGetLogoutVideo } from '@/api/hooks/useGetLogoutVideo';
import { useGetMyInfluencerVideo } from '@/api/hooks/useGetMyInfluencerVideo';
import useGetLocation from '@/hooks/useGetLocation';
import { useGetAroundVideo } from '@/api/hooks/useGetAroundVideo';
import { fetchInstance } from '@/api/instance';

export default function MainPage() {
  const { isAuthenticated } = useAuth();
  const location = useGetLocation();

  const [{ data: bannerData }, { data: influencersData }] = useGetMain();
  const [{ data: coolVideoData }, { data: newVideoData }] = useGetLogoutVideo(!isAuthenticated);
  const { data: myInfluencerVideoData } = useGetMyInfluencerVideo(!!isAuthenticated);
  const { data: aroundVideoData } = useGetAroundVideo(
    location?.lat ?? 37.5665,
    location?.lng ?? 126.978,
    !!isAuthenticated && !!location?.lat && !!location?.lng,
  );

  useEffect(() => {
    const testSentryError = async () => {
      try {
        // 존재하지 않는 엔드포인트로 요청
        await fetchInstance.get('/non-existent-endpoint');
      } catch (error) {
        console.log('API 요청은 실패했지만 계속 실행됨');
      }

      // 실제 동작하는 API 엔드포인트로 요청
      try {
        const response = await fetchInstance.get('/banners');
        console.log('이 요청은 성공해야 함:', response.data);
      } catch (error) {
        console.log('이 에러는 Sentry와 무관해야 함:', error);
      }
    };

    testSentryError();
  }, []);

  return (
    <>
      <ResearchModal />
      <Wrapper>
        <SearchBar placeholder="인플루언서, 장소를 검색해주세요!" />
        <MainBanner items={bannerData} />
        <BaseLayout
          type="influencer"
          mainText="인플루언서"
          SubText=" 가 방문한 장소를 찾아볼까요?"
          items={influencersData.content}
        />
        {isAuthenticated ? (
          <>
            <BaseLayout
              type="spot"
              prevSubText="내 "
              mainText="인플루언서"
              SubText="가 방문한 그곳!"
              items={myInfluencerVideoData || []}
            />
            {location?.lat && location?.lng && (
              <BaseLayout
                type="spot"
                prevSubText="내 "
                mainText="주변"
                SubText="에 있는 그곳!"
                items={aroundVideoData || []}
              />
            )}
          </>
        ) : (
          <>
            <BaseLayout type="spot" prevSubText="지금 " mainText="쿨" SubText=" 한 그곳!" items={coolVideoData || []} />
            <BaseLayout type="spot" mainText="새로" SubText=" 등록된 그곳!" items={newVideoData || []} />
          </>
        )}
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media screen and (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }
`;
