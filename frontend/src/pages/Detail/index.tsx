import { useCallback, useEffect, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
// import { RiKakaoTalkFill } from 'react-icons/ri';
import { GrPrevious, GrNext } from 'react-icons/gr';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
// import { ErrorBoundary } from 'react-error-boundary';
import { PiHeartFill, PiHeartLight } from 'react-icons/pi';
// import Button from '@/components/common/Button';
import { Text } from '@/components/common/typography/Text';
import InfoTap from '@/components/Detail/InfoTap';
// import ReviewTap from '@/components/Detail/ReviewTap';
import VisitModal from '@/components/Detail/VisitModal';
import { useGetPlaceInfo } from '@/api/hooks/useGetPlaceInfo';
// import Loading from '@/components/common/layouts/Loading';
// import Error from '@/components/common/layouts/Error';
import FallbackImage from '@/components/common/Items/FallbackImage';
import BasicThumb from '@/assets/images/basic-thumb.png';
import { usePostPlaceLike } from '@/api/hooks/usePostPlaceLike';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';

export default function DetailPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  // const [activeTab, setActiveTab] = useState<'info' | 'review'>('info');
  const [visitModal, setVisitModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { id } = useParams() as { id: string };
  const { data: infoData } = useGetPlaceInfo(id);
  const [isMobile, setIsMobile] = useState(false);
  const [isLike, setIsLike] = useState(infoData.likes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: postLike } = usePostPlaceLike();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentVideoUrl = infoData?.videos[currentVideoIndex]?.videoUrl || '';

  const extractYoutubeId = (url: string) => {
    const match = url?.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]*)(&(amp;)?[\w?=]*)?/);
    const youtubeId = match && match[1] ? match[1] : null;
    const youtubeUrl = isMobile
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    return youtubeUrl;
  };

  const handleBtnPrevClick = () => {
    setCurrentVideoIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleBtnNextClick = () => {
    if (infoData?.videos?.length > 1) {
      setCurrentVideoIndex((prev) => Math.min(prev + 1, infoData.videos.length - 1));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (infoData?.videos?.length > 1) {
        setCurrentVideoIndex((prevIndex) => (prevIndex === infoData.videos.length - 1 ? 0 : prevIndex + 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [infoData?.videos?.length]);

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
        { placeId: Number(id), likes: newLikeStatus },
        {
          onSuccess: () => {
            setIsLike(newLikeStatus);
            queryClient.invalidateQueries({ queryKey: ['UserPlace'] });
            queryClient.invalidateQueries({ queryKey: ['placeInfo', id] });
          },
          onError: () => {
            alert('좋아요 등록에 실패했어요. 다시 시도해주세요!');
          },
        },
      );
    },
    [isLike, id, postLike],
  );

  return (
    <Wrapper>
      <ImageContainer>
        <CarouselWrapper>
          <CarouselContainer $currentIndex={currentVideoIndex}>
            {infoData?.videos?.map((url) => {
              const isYoutubeUrl = url.videoUrl?.includes('youtu');
              const youtubeUrl = isYoutubeUrl ? extractYoutubeId(url.videoUrl) : BasicThumb;
              return (
                <ImageWrapper key={`${id}-${url.videoUrl}`}>
                  <FallbackImage src={youtubeUrl} alt="장소 사진" />
                </ImageWrapper>
              );
            })}
          </CarouselContainer>
        </CarouselWrapper>
        <GradientOverlay />
        {infoData?.videos && infoData.videos.length > 1 && (
          <>
            <PrevBtn aria-label="prev_btn" onClick={handleBtnPrevClick} disabled={currentVideoIndex === 0}>
              <GrPrevious size={40} color="white" />
            </PrevBtn>
            <NextBtn
              aria-label="next_btn"
              onClick={handleBtnNextClick}
              disabled={currentVideoIndex === infoData.videos.length - 1}
            >
              <GrNext size={40} color="white" />
            </NextBtn>
          </>
        )}
        <TitleContainer>
          <TitleWrapper>
            <Text size="ll" weight="bold" variant="white">
              {infoData.placeName}
            </Text>
            <LikeIcon
              role="button"
              aria-label="like_btn"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickLike(e)}
            >
              {isLike ? (
                <PiHeartFill color="#fe7373" size={30} data-testid="PiHeartFill" />
              ) : (
                <PiHeartLight color="white" size={30} data-testid="PiHeartLight" />
              )}
            </LikeIcon>
          </TitleWrapper>
          <ButtonWrapper>
            {/* <StyledButton aria-label="visit_btn" variant="visit" onClick={() => setVisitModal(!visitModal)}>
              <RiKakaoTalkFill size={20} color="yellow" />
              방문할래요
            </StyledButton> */}
            <a href={currentVideoUrl}>
              <FaYoutube size={46} color="red" style={{ marginTop: '4px' }} />
            </a>
          </ButtonWrapper>
        </TitleContainer>
      </ImageContainer>
      <TapContainer>
        <Tap aria-label="info_tap" /* $active={activeTab === 'info'} onClick={() => setActiveTab('info')} */>정보</Tap>
        {/* <Tap aria-label="review_tap" $active={activeTab === 'review'} onClick={() => setActiveTab('review')}>
          리뷰
        </Tap> */}
      </TapContainer>
      <InfoContainer>
        {/* {activeTab === 'info' ? ( */}
        <InfoTap
          category={infoData?.category}
          facility={infoData?.facility}
          openingHours={infoData?.openingHours}
          kakaoPlaceUrl={infoData?.kakaoPlaceUrl}
          googlePlaceUrl={infoData?.googlePlaceUrl}
          googleReviews={infoData?.googleReviews}
          longitude={infoData?.longitude}
          latitude={infoData?.latitude}
          rating={infoData?.rating}
        />
        {/* ) : (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary FallbackComponent={Error} onReset={reset}>
                <Suspense fallback={<Loading size={50} />}>
                  <ReviewTap placeLikes={infoData?.placeLikes} id={id} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        )} */}
      </InfoContainer>
      {visitModal && (
        <VisitModal id={infoData?.placeId} placeName={infoData?.placeName} onClose={() => setVisitModal(false)} />
      )}
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
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

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const CarouselContainer = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${(props) => props.$currentIndex * 100}%);
  width: 100%;
`;

const ImageWrapper = styled.div`
  flex: 0 0 100%;
  width: 100%;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  object-position: center;
  display: block;

  @media screen and (max-width: 768px) {
    aspect-ratio: 16 / 9;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 50%;
  gap: 10px;
  align-items: end;
  @media screen and (max-width: 768px) {
    gap: 4px;
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
  @media screen and (max-width: 768px) {
    bottom: 4px;
  }
`;

const Tap = styled.button`
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
  color: #55ebff;
  border: none;
  border-bottom: 3px solid #55ebff;
  background: none;
  cursor: pointer;
  transition:
    color 0.3s ease,
    border-bottom 0.3s ease;

  @media screen and (max-width: 768px) {
    height: 50px;
    font-size: 16px;
    border-bottom: 2px solid #55ebff;
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
const LikeIcon = styled.div`
  width: 30px;
  height: 32px;
  z-index: 100;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: 24px;
    height: 24px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;
// const StyledButton = styled(Button)`
//   padding: 0px 16px;
//   height: 30px;
//   font-size: 14px;
//   gap: 4px;
//   font-weight: bold;

//   @media screen and (max-width: 768px) {
//     svg {
//       width: 18px;
//     }
//     padding: 2px 10px;
//     height: 28px;
//     font-size: 12px;
//     gap: 4px;
//   }
// `;
