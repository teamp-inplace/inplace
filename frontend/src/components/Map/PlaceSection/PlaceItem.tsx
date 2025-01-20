import styled from 'styled-components';
import { PiHeartFill, PiHeartLight } from 'react-icons/pi';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Text } from '@/components/common/typography/Text';
import { PlaceData } from '@/types';
import { usePostPlaceLike } from '@/api/hooks/usePostPlaceLike';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';
import FallbackImage from '@/components/common/Items/FallbackImage';

interface PlaceItemProps extends PlaceData {
  onClick: () => void;
  isSelected: boolean;
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
  menuImgUrl,
  onClick,
  isSelected,
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
        <ImageContainer>
          <FallbackImage src={menuImgUrl} alt={placeName} />
        </ImageContainer>
        <CardContent>
          <PlaceDetails>
            <Text size="l" weight="bold" variant="white">
              {placeName}
            </Text>
            <Address>
              <Text size="s" weight="normal" variant="white">
                {getFullAddress(address)}
              </Text>
            </Address>
            <InfluencerName>
              <Text size="s" weight="normal" variant="white">
                {influencerName}
              </Text>
            </InfluencerName>
          </PlaceDetails>
          <LikeIcon role="button" onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickLike(e)}>
            {isLike ? (
              <PiHeartFill color="#fe7373" size={32} data-testid="PiHeartFill" />
            ) : (
              <PiHeartLight color="white" size={32} data-testid="PiHeartLight" />
            )}
          </LikeIcon>
        </CardContent>
      </PlaceCard>
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}

const PlaceCard = styled.div<{ $isSelected: boolean }>`
  width: 460px;
  height: 160px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ $isSelected }) => ($isSelected ? '#1b1a1a' : 'none')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1b1a1a;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 10px;
  top: 30px;
  object-fit: cover;
  border-radius: 30px;
`;

const CardContent = styled.div`
  position: absolute;
  width: 320px;
  height: 100px;
  left: 130px;
  top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaceDetails = styled.div`
  position: relative;
  width: 290px;
  height: 102px;
`;

const Address = styled.div`
  position: absolute;
  top: 30px;
`;

const InfluencerName = styled.div`
  position: absolute;
  top: 70px;
`;

const LikeIcon = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  right: 10px;
  top: 12px;
  z-index: 100;
  cursor: pointer;
`;
