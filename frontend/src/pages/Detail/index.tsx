import { Suspense, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';

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
  const { id } = useParams() as { id: string };
  const { data: infoData } = useGetPlaceInfo(id);
  const extractedVideoId = useExtractYoutubeVideoId(infoData.videoUrl || '');
  const thumbnailUrl = infoData.videoUrl
    ? `https://img.youtube.com/vi/${extractedVideoId}/maxresdefault.jpg`
    : BasicThumb;
  return (
    <Wrapper>
      <ImageContainer>
        <ImageWrapper>
          <FallbackImage src={thumbnailUrl} alt="장소 사진" />
        </ImageWrapper>
        <GradientOverlay />
        <TitleContainer>
          <Text size="ll" weight="bold" variant="white">
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
            <a href={infoData.videoUrl}>
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

  @media screen and (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
`;
const ImageContainer = styled.div`
  position: relative;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  object-position: center;
  display: block;

  @media screen and (max-width: 768px) {
    aspect-ratio: 16 / 9;
  }
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
  /* z-index: 1; */
  @media screen and (max-width: 768px) {
    bottom: 4px;
  }
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

  @media screen and (max-width: 768px) {
    height: 50px;
    font-size: 16px;
    border-bottom: 2px solid ${({ $active }) => ($active ? '#55ebff' : 'white')};
  }
`;
const TapContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media screen and (max-width: 768px) {
    a > svg {
      width: 30px;
    }
    gap: 10px;
  }
`;
const InfoContainer = styled.div`
  padding-top: 20px;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
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
