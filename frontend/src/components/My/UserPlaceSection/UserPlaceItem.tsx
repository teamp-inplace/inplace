import { PiHeartFill, PiHeartLight } from 'react-icons/pi';
import { Link, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import { useCallback, useState } from 'react';
import { Paragraph } from '@/components/common/typography/Paragraph';

import { UserPlaceData } from '@/types';
import { usePostPlaceLike } from '@/api/hooks/usePostPlaceLike';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';
import FallbackImage from '@/components/common/Items/FallbackImage';

export default function UserPlaceItem({ placeId, placeName, imageUrl, influencer, likes }: UserPlaceData) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLike, setIsLike] = useState(likes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: postLike } = usePostPlaceLike();

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
        { placeId, likes: newLikeStatus },
        {
          onSuccess: () => {
            setIsLike(newLikeStatus);
          },
          onError: (error) => {
            console.error('Error:', error);
          },
        },
      );
    },
    [isLike, placeId, postLike],
  );
  return (
    <>
      <Wrapper to={`/detail/${placeId}`}>
        <ImageContainer>
          <LikeIcon onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickLike(e)}>
            {isLike ? <PiHeartFill color="#fe7373" size={32} /> : <PiHeartLight color="white" size={32} />}
          </LikeIcon>
          <FallbackImage src={imageUrl} alt={String(placeId)} />
        </ImageContainer>
        <TextWrapper>
          <Paragraph size="m" weight="bold" variant="white">
            {placeName}
          </Paragraph>
          <Paragraph size="xs" weight="normal" variant="white">
            {influencer}
          </Paragraph>
        </TextWrapper>
      </Wrapper>
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
const Wrapper = styled(Link)`
  width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  gap: 10px;

  @media screen and (max-width: 768px) {
    height: 100%;
    aspect-ratio: 1.2 / 2;
    width: auto;
  }
`;
const ImageContainer = styled.div`
  width: 168px;
  height: 208px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 4px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
const LikeIcon = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  right: 10px;
  top: 12px;
  z-index: 100;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    top: 8px;
    right: 6px;
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;
const TextWrapper = styled.div`
  > *:not(:first-child) {
    margin-top: 6px;
    @media screen and (max-width: 768px) {
      margin-top: 4px;
    }
  }
`;
