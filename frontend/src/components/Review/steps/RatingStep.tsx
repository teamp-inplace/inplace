import styled from 'styled-components';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { ReviewInfo } from '@/types';
import { Paragraph } from '@/components/common/typography/Paragraph';
import { Text } from '@/components/common/typography/Text';
import FallbackImage from '@/components/common/Items/FallbackImage';

interface RatingStepProps {
  onSubmit: (isLiked: boolean) => void;
  placeInfo: ReviewInfo;
}

interface RatingButtonProps {
  buttonType: 'like' | 'dislike';
}

export default function RatingStep({ onSubmit, placeInfo }: RatingStepProps) {
  return (
    <StepContainer>
      <TitleSection>
        <Paragraph size="l" weight="normal">
          방문하신&nbsp;
        </Paragraph>
        <Paragraph size="xl" weight="bold" variant="mint">
          {placeInfo.placeName}
        </Paragraph>
        <Paragraph size="l" weight="normal">
          , 어떠셨나요?
        </Paragraph>
      </TitleSection>

      <PlaceSection>
        <ImageFrame>
          <ImageWrapper>
            <FallbackImage src={placeInfo.placeImgUrl} alt="Place Image" />
          </ImageWrapper>
        </ImageFrame>
        <PlaceInfo>
          <TextWrapper className="name">
            <Text size="m" weight="bold" style={{ color: '#c6c6c6' }}>
              {placeInfo.placeName}
            </Text>
          </TextWrapper>
          <TextWrapper className="address">
            <Text size="xs" weight="normal" style={{ color: '#c6c6c6' }}>
              {placeInfo.placeAddress}
            </Text>
          </TextWrapper>
          <TextWrapper className="influencer">
            <Text size="xs" weight="normal" variant="white">
              {placeInfo.influencerName}
            </Text>
          </TextWrapper>
        </PlaceInfo>
      </PlaceSection>

      <RatingSection>
        <RatingButton onClick={() => onSubmit(true)} buttonType="like">
          <AiFillLike size={54} />
          <ButtonText>좋았어요</ButtonText>
        </RatingButton>

        <RatingButton onClick={() => onSubmit(false)} buttonType="dislike">
          <AiFillDislike size={54} />
          <ButtonText>아쉬워요</ButtonText>
        </RatingButton>
      </RatingSection>
    </StepContainer>
  );
}

const StepContainer = styled.div`
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 30%;
  margin-bottom: 1rem;
`;

const PlaceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
`;

const ImageFrame = styled.div`
  position: relative;
  margin-top: 5rem;
  margin-bottom: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: -1.25rem;
    left: -1.25rem;
    width: 3.75rem;
    height: 3.75rem;
    border-left: 1.5px solid white;
    border-top: 1.5px solid white;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1.25rem;
    right: -1.25rem;
    width: 3.75rem;
    height: 3.75rem;
    border-right: 1.5px solid white;
    border-bottom: 1.5px solid white;
  }
`;

const ImageWrapper = styled.div`
  width: 12rem;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin: 1rem;
`;

const PlaceInfo = styled.div`
  align-self: flex-start;
  margin-bottom: 1rem;
  margin-left: calc((100% - 12rem) / 2);
`;

const TextWrapper = styled.div`
  &.name {
    margin-bottom: 0.2rem;
  }

  &.address {
    margin-bottom: 0.5rem;
  }
`;

const RatingSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 6rem;
  margin: 1.5rem 0;
`;

const RatingButton = styled.button<RatingButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  color: ${(props) => (props.buttonType === 'like' ? '#D85B53' : '#595BD4')};
  background-color: transparent;
  transition: all 0.2s ease;
  padding: 1rem;
  box-shadow: none;
  border: none;
  border-radius: 0.5rem;
`;

const ButtonText = styled.span`
  font-size: 0.95rem;
  color: white;
`;
