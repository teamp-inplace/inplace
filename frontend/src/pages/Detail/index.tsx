import { Suspense, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { GrPrevious, GrNext } from 'react-icons/gr';

import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@/components/common/Button';
import { Text } from '@/components/common/typography/Text';
import InfoTap from '@/components/Detail/InfoTap';
import ReviewTap from '@/components/Detail/ReviewTap';
import VisitModal from '@/components/Detail/VisitModal';

import useExtractYoutubeVideoId from '@/libs/youtube/useExtractYoutube';
import { useGetPlaceInfo } from '@/api/hooks/useGetPlaceInfo';
import Loading from '@/components/common/layouts/Loading';
import Error from '@/components/common/layouts/Error';
import FallbackImage from '@/components/common/Items/FallbackImage';
import BasicThumb from '@/assets/images/basic-thumb.png';

export default function DetailPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'review'>('info');
  const [visitModal, setVisitModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { id } = useParams() as { id: string };
  const { data: infoData } = useGetPlaceInfo(id);

  const currentVideoUrl = infoData.videoUrl?.[currentVideoIndex] || '';
  const extractedVideoId = useExtractYoutubeVideoId(currentVideoUrl);
  const thumbnailUrl = currentVideoUrl
    ? `https://img.youtube.com/vi/${extractedVideoId}/maxresdefault.jpg`
    : BasicThumb;

  const handleBtnPrevClick = () => {
    setCurrentVideoIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleBtnNextClick = () => {
    if (infoData.videoUrl.length > 1) {
      setCurrentVideoIndex((prev) => Math.min(prev + 1, infoData.videoUrl.length - 1));
    }
  };

  return (
    <Wrapper>
      <ImageContainer>
        <ImageWrapper>
          <FallbackImage src={thumbnailUrl} alt="장소 사진" />
        </ImageWrapper>
        <GradientOverlay />
        {infoData.videoUrl && infoData.videoUrl.length > 1 && (
          <>
            <PrevBtn onClick={handleBtnPrevClick} disabled={currentVideoIndex === 0}>
              <GrPrevious size={40} color="white" />
            </PrevBtn>
            <NextBtn onClick={handleBtnNextClick} disabled={currentVideoIndex === infoData.videoUrl.length - 1}>
              <GrNext size={40} color="white" />
            </NextBtn>
          </>
        )}
        <TitleContainer>
          <Text size="26px" weight="bold" variant="white">
            {infoData.placeName}
          </Text>
          <ButtonWrapper>
            <Button
              variant="visit"
              style={{
                width: '120px',
                height: '30px',
                fontSize: '14px',
                fontWeight: 'bold',
                gap: '4px',
              }}
              onClick={() => setVisitModal(!visitModal)}
            >
              <RiKakaoTalkFill size={20} color="yellow" />
              방문할래요
            </Button>
            <a href={currentVideoUrl}>
              <FaYoutube size={46} color="red" style={{ marginTop: '4px' }} />
            </a>
          </ButtonWrapper>
        </TitleContainer>
      </ImageContainer>
      <TapContainer>
        <Tap $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
          정보
        </Tap>
        <Tap $active={activeTab === 'review'} onClick={() => setActiveTab('review')}>
          리뷰
        </Tap>
      </TapContainer>
      <InfoContainer>
        {activeTab === 'info' ? (
          <InfoTap
            facilityInfo={infoData.facilityInfo}
            openHour={infoData.openHour}
            menuInfos={infoData.menuInfos}
            longitude={infoData.longitude}
            latitude={infoData.latitude}
          />
        ) : (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary FallbackComponent={Error} onReset={reset}>
                <Suspense fallback={<Loading size={50} />}>
                  <ReviewTap placeLikes={infoData.placeLikes} id={id} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        )}
      </InfoContainer>
      {visitModal && (
        <VisitModal id={infoData.placeId} placeName={infoData.placeName} onClose={() => setVisitModal(false)} />
      )}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const ImageContainer = styled.div`
  position: relative;
`;
const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  object-position: center;
  display: block;
`;
const TitleContainer = styled.div`
  position: absolute;
  width: 90%;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
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
const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const InfoContainer = styled.div`
  padding-top: 20px;
`;
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.9) 100%);
  z-index: 0;
  pointer-events: none;
`;

const PrevBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
