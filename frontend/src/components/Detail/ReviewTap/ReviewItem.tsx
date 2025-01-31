import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import styled from 'styled-components';

import { Paragraph } from '@/components/common/typography/Paragraph';
import { Text } from '@/components/common/typography/Text';

import { ReviewData } from '@/types';
import { useDeleteReview } from '@/api/hooks/useDeleteReview';

export default function ReviewItem({
  reviewId,
  likes,
  comment,
  userNickname,
  createdDate,
  mine,
  handleDelete,
}: ReviewData & { handleDelete: (id: string) => void }) {
  const { mutate: deleteReview } = useDeleteReview();
  const handleDeleteReview = () => {
    const isConfirm = window.confirm('삭제하시겠습니까?');
    if (!isConfirm) return;

    deleteReview(String(reviewId), {
      onSuccess: () => {
        alert('삭제되었습니다.');
        handleDelete(String(reviewId));
      },
      onError: () => {
        alert('리뷰를 삭제하지 못했어요. 다시 시도해주세요!');
      },
    });
  };
  return (
    <Wrapper>
      <Title>
        <Name>
          <Text size="xs" weight="bold" variant="white">
            {userNickname}
          </Text>
          {likes ? <AiFillLike size={22} color="#fe7373" /> : <AiFillDislike size={22} color="#6F6CFF" />}
        </Name>
        <Text size="xs" weight="normal" variant="white">
          {new Date(createdDate).toLocaleDateString()}
        </Text>
      </Title>
      <Comment>
        <Paragraph size="xs" weight="normal" variant="white">
          {comment}
        </Paragraph>
        {mine ? (
          <DeleteBtn aria-label="delete_btn" onClick={handleDeleteReview}>
            삭제
          </DeleteBtn>
        ) : null}
      </Comment>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: end;
  line-height: 150%;
  gap: 2px;

  svg {
    margin-left: 20px;
  }
  @media screen and (max-width: 768px) {
    line-height: 130%;
    svg {
      margin-left: 10px;
      width: 20px;
      height: 16px;
    }
  }
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Name = styled.div``;
const DeleteBtn = styled.button`
  font-size: 14px;
  color: #b0b0b0;
  background: none;
  border: none;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const Comment = styled.div`
  display: flex;
  justify-content: space-between;
`;
