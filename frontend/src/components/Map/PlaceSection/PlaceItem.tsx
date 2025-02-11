import styled from 'styled-components';
import { PiHeartFill, PiHeartLight } from 'react-icons/pi';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Text } from '@/components/common/typography/Text';
import { PlaceData } from '@/types';
import { usePostPlaceLike } from '@/api/hooks/usePostPlaceLike';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';
// import FallbackImage from '@/components/common/Items/FallbackImage';

interface PlaceItemProps extends PlaceData {
  onClick: () => void;
  isSelected?: boolean;
}
const getFullAddress = (addr: PlaceData['address']) => {
  return [addr.address1, addr.address2, addr.address3].filter(Boolean).join(' ');
};

export default function PlaceItem({
  placeId,
  placeName,
  address,
  influencerName,
  likes,
  // menuImgUrl,
  onClick,
  isSelected = false,
}: PlaceItemProps) {
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
          onError: () => {
            alert('좋아요 등록에 실패했어요. 다시 시도해주세요!');
          },
        },
      );
    },
    [isLike, placeId, postLike],
  );
  useEffect(() => {
    setIsLike(likes);
  }, [likes]);

  return (
    <>
      <PlaceCard key={placeId} onClick={onClick} $isSelected={isSelected}>
        <CardContent>
          {/* <ImageContainer>
          <FallbackImage src={menuImgUrl} alt={placeName} />
        </ImageContainer> */}
          <Text size="m" weight="bold" variant="white">
            {placeName}
          </Text>
          <Text size="xs" weight="normal" variant="white">
            {getFullAddress(address)}
          </Text>
          <InfluencerName>
            <Text size="xs" weight="normal" variant="white">
              {influencerName}
            </Text>
          </InfluencerName>
        </CardContent>
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
      </PlaceCard>
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}

const PlaceCard = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  background-color: ${({ $isSelected }) => ($isSelected ? '#1b1a1a' : 'none')};
  transition: background-color 0.1s ease;
  box-sizing: border-box;

  &:hover {
    background-color: #1b1a1a;
  }

  @media screen and (max-width: 768px) {
    height: 100%;
    gap: 12px;
    padding: 10px 8px;
  }
`;

// const ImageContainer = styled.div`
//   width: 20%;
//   aspect-ratio: 1;
//   object-fit: cover;
//   border-radius: 30px;

//   @media screen and (max-width: 768px) {
//     width: 10%;
//     border-radius: 12px;
//   }

//   @media screen and (max-width: 430px) {
//     width: 20%;
//     border-radius: 12px;
//   }
// `;

const CardContent = styled.div`
  position: relative;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media screen and (max-width: 768px) {
    width: 90%;
    gap: 8px;
  }
`;

const InfluencerName = styled.div`
  padding-top: 6px;

  @media screen and (max-width: 768px) {
    padding-top: 2px;
  }
`;

const LikeIcon = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  right: 10px;
  top: 20px;
  z-index: 100;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: 24px;
    height: 24px;
    right: 10px;
    top: 16px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;
