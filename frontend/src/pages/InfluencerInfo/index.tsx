import { PiHeartFill, PiHeartLight } from 'react-icons/pi';

import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Error from '@/components/common/layouts/Error';
import { Text } from '@/components/common/typography/Text';
import FallbackImage from '@/components/common/Items/FallbackImage';
import useAuth from '@/hooks/useAuth';
import { usePostInfluencerLike } from '@/api/hooks/usePostInfluencerLike';
import LoginModal from '@/components/common/modals/LoginModal';
import { useGetInfluencerInfo } from '@/api/hooks/useGetInfluencerInfo';
import Loading from '@/components/common/layouts/Loading';
import InfluencerVideoTap from '@/components/InfluencerInfo/InfluencerVideoTap';
import InfluencerMapTap from '@/components/InfluencerInfo/InfluencerMapTap';
import { useGetInfluencerVideo } from '@/api/hooks/useGetInfluencerVideo';

export default function InfluencerInfoPage() {
  const { id } = useParams() as { id: string };
  const { data: influencerInfoData } = useGetInfluencerInfo(id);
  const influencerId = Number(id);

  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'video' | 'map'>('video');
  const [isLike, setIsLike] = useState(influencerInfoData.likes);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { mutate: postLike } = usePostInfluencerLike();
  const {
    data: videos,
    fetchNextPage: videoFetchNextPage,
    hasNextPage: videoHasNextPage,
    isFetchingNextPage: videoIsFetchingNextPage,
  } = useGetInfluencerVideo(6);

  const handleClickLike = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
      const newLikeStatus = !isLike;
      postLike(
        { influencerId, likes: newLikeStatus },
        {
          onSuccess: () => {
            setIsLike(newLikeStatus);
          },
          onError: () => {
            alert('좋아요 등록에 실패했어요. 다시 시도해주세요!');
          },
        },
      );
    },
    [isLike, influencerId, postLike],
  );

  useEffect(() => {
    setIsLike(influencerInfoData.likes);
  }, [influencerInfoData.likes]);

  return (
    <PageContainer>
      <InfluencerInfoSection>
        <Image>
          <FallbackImage src={influencerInfoData.influencerImgUrl} alt={influencerInfoData.influencerName} />
        </Image>
        <TextInfo>
          <Text size="xxl" weight="bold" variant="white">
            {influencerInfoData.influencerName}
          </Text>
          <Text size="m" weight="normal" variant="white">
            좋아요 수 {influencerInfoData.follower}명 • 쿨 플레이스 {influencerInfoData.placeCount}곳
          </Text>
          <Text size="s" weight="normal" variant="white">
            {influencerInfoData.influencerJob}
          </Text>
        </TextInfo>
        <LikeIcon role="button" onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickLike(e)}>
          {isLike ? (
            <PiHeartFill color="#fe7373" size={32} data-testid="PiHeartFill" />
          ) : (
            <PiHeartLight color="white" size={32} data-testid="PiHeartLight" />
          )}
        </LikeIcon>
      </InfluencerInfoSection>
      <TapContainer>
        <Tap $active={activeTab === 'video'} onClick={() => setActiveTab('video')}>
          쿨한 그곳
        </Tap>
        <Tap $active={activeTab === 'map'} onClick={() => setActiveTab('map')}>
          쿨 플레이스
        </Tap>
      </TapContainer>
      <InfoContainer>
        {activeTab === 'video' ? (
          <InfluencerVideoTap
            items={videos.pages.flatMap((page) => page.content)}
            hasNextPage={videoHasNextPage}
            fetchNextPage={videoFetchNextPage}
            isFetchingNextPage={videoIsFetchingNextPage}
          />
        ) : (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary FallbackComponent={Error} onReset={reset}>
                <Suspense fallback={<Loading size={50} />}>
                  <InfluencerMapTap influencerImg={influencerInfoData.influencerImgUrl} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        )}
      </InfoContainer>
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 50px;
`;
const InfluencerInfoSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Image = styled.div`
  width: 232px;
  border-radius: 50%;
  aspect-ratio: 1;
`;
const TextInfo = styled.div`
  width: 100%;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;
const LikeIcon = styled.div`
  width: 30px;
  height: 30px;
  padding-top: 30px;
  cursor: pointer;
`;
const Tap = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ $active }) => ($active ? '#55ebff' : 'white')};
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#55ebff' : 'white')};
  background: none;
  cursor: pointer;
  transition:
    color 0.3s ease,
    border-bottom 0.3s ease;
`;
const TapContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const InfoContainer = styled.div`
  padding-top: 20px;
`;
