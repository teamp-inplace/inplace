import { PiHeartFill, PiHeartLight } from 'react-icons/pi';
import { Link, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Paragraph } from '@/components/common/typography/Paragraph';

import { UserPlaceData } from '@/types';
import { usePostPlaceLike } from '@/api/hooks/usePostPlaceLike';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';

const getFullAddress = (addr: UserPlaceData['address']) => {
  return [addr.address1, addr.address2, addr.address3].filter(Boolean).join(' ');
};

export default function UserPlaceItem({ placeId, placeName, influencerName, likes, address }: UserPlaceData) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLike, setIsLike] = useState(likes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: postLike } = usePostPlaceLike();
  const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({ queryKey: ['UserPlace'] }); // 내가 좋아요 한 장소
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
        <TextWrapper>
          <Paragraph size="m" weight="bold" variant="white">
            {placeName}
          </Paragraph>
          <Paragraph size="xs" weight="normal" variant="white">
            {getFullAddress(address)}
          </Paragraph>
          <Paragraph size="xs" weight="normal" variant="white">
            {influencerName}
          </Paragraph>
        </TextWrapper>
        <LikeIcon onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickLike(e)}>
          {isLike ? <PiHeartFill color="#fe7373" size={26} /> : <PiHeartLight color="white" size={30} />}
        </LikeIcon>
      </Wrapper>
      {showLoginModal && (
        <LoginModal immediateOpen currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
const Wrapper = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  height: 100px;
  border-radius: 4px;
  padding: 10px;

  &:hover {
    background-color: #1b1a1a;
  }
  @media screen and (max-width: 768px) {
    height: 80px;
  }
`;

const LikeIcon = styled.div`
  position: absolute;
  width: 26px;
  height: 24px;
  right: 10px;
  top: 12px;
  z-index: 100;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    top: 14px;
    right: 6px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px 10px;
  gap: 4px;
  > *:nth-child(3) {
    margin-top: 12px;
    @media screen and (max-width: 768px) {
      margin-top: 4px;
    }
  }
`;
