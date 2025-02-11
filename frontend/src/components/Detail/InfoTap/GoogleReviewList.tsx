import styled from 'styled-components';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { Paragraph } from '@/components/common/typography/Paragraph';

import { GoogleReview } from '@/types';
import { Text } from '@/components/common/typography/Text';
import NoItem from '@/components/common/layouts/NoItem';

export default function GoogleReviewList({ lists }: { lists: GoogleReview[] }) {
  return (
    <Wrapper>
      {lists.length === 0 ? (
        <NoItem message="구글 리뷰 정보가 없습니다." height={100} logo={false} alignItems="start" />
      ) : (
        <>
          {lists.map((list) => (
            <GoogleReviewItem key={list.name}>
              <Title>
                <Name>
                  <Text size="xs" weight="bold" variant="white">
                    {list.name}
                  </Text>
                  {list.like ? <AiFillLike size={22} color="#fe7373" /> : <AiFillDislike size={22} color="#6F6CFF" />}
                </Name>
                <Text size="xs" weight="normal" variant="white">
                  {new Date(list.publishTime).toLocaleDateString()}
                </Text>
              </Title>
              <Paragraph size="xs" weight="normal" variant="white">
                {list.text}
              </Paragraph>
            </GoogleReviewItem>
          ))}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  line-height: 150%;
  width: 100%;
  flex-direction: column;
  gap: 30px;
  align-items: end;
  svg {
    margin-left: 20px;
  }

  @media screen and (max-width: 768px) {
    svg {
      margin-left: 10px;
      width: 20px;
      height: 16px;
    }
  }
`;

const GoogleReviewItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media screen and (max-width: 768px) {
    width: 90%;
    gap: 2px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Name = styled.div`
  display: flex;
  gap: 10px;
`;
