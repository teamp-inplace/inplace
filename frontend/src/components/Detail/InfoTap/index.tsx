import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { IoMdStar } from 'react-icons/io';
import { FaComment } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Paragraph } from '@/components/common/typography/Paragraph';
import FacilitySign from './FacilitySign';
import { FacilityInfo, GoogleReview } from '@/types';
import OpenHour from './OpenHour';
import { Text } from '@/components/common/typography/Text';
import GoogleReviewList from '../GoogleReviewList';
import Button from '@/components/common/Button';
import NoItem from '@/components/common/layouts/NoItem';

type Props = {
  category: string;
  facility: FacilityInfo;
  openingHours: string[];
  kakaoPlaceUrl: string;
  googlePlaceUrl: string;
  googleReviews: GoogleReview[];
  longitude: string;
  latitude: string;
  rating: number;
};
export default function InfoTap({
  category,
  facility,
  openingHours,
  kakaoPlaceUrl,
  googlePlaceUrl,
  googleReviews,
  longitude,
  latitude,
  rating,
}: Props) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    <Wrapper>
      <ButtonWrapper>
        <StyledButton
          aria-label="kakao_btn"
          variant="outline"
          onClick={() => {
            window.location.href = kakaoPlaceUrl;
          }}
        >
          <FaComment size={16} color="fee500" />
          카카오맵
        </StyledButton>
        {googlePlaceUrl ? (
          <StyledButton
            aria-label="google_btn"
            variant="outline"
            onClick={() => {
              window.location.href = googlePlaceUrl;
            }}
          >
            <FcGoogle size={18} />
            구글맵
          </StyledButton>
        ) : null}
      </ButtonWrapper>
      {googlePlaceUrl ? (
        <>
          <Paragraph size="s" weight="bold" variant="white">
            시설 정보
          </Paragraph>
          <FacilitySign category={category} facilityInfo={facility} />
          <Paragraph size="s" weight="bold" variant="white">
            운영 시간
          </Paragraph>
          <OpenHour openHour={openingHours} />
          <GoogleReviewTitle>
            <StyledText size="s" weight="bold" variant="white">
              Google 리뷰
              <IoMdStar size={20} color="#FBBC04" />
              <Text size="xs" weight="normal" variant="white">
                {rating}
              </Text>
            </StyledText>
            <GoogleDescription>
              <Text size="xs" weight="normal" variant="grey">
                구글 평점 3점 이상일 경우, 좋아요로 표시됩니다.
              </Text>
              <Text size="xs" weight="normal" variant="grey">
                Google 제공
              </Text>
            </GoogleDescription>
          </GoogleReviewTitle>
          <GoogleReviewContainer>
            <GoogleReviewList lists={googleReviews} />
          </GoogleReviewContainer>
        </>
      ) : (
        <NoItem
          message={`장소 세부정보를 확인할 수 없어요.\n카카오맵에서 확인해주세요.`}
          height={200}
          logo
          alignItems="center"
        />
      )}
      <Paragraph size="s" weight="bold" variant="white">
        지도 보기
      </Paragraph>
      <MapContainer>
        <Map
          center={{
            lat,
            lng,
          }}
          style={{
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          level={3}
        >
          <MapMarker
            position={{
              lat,
              lng,
            }}
          />
        </Map>
      </MapContainer>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media screen and (max-width: 768px) {
    gap: 30px;
  }
`;
const GoogleReviewContainer = styled.div`
  padding: 0px 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0px;
  }
`;

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 95%;
  height: 410px;
  margin-bottom: 120px;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 300px;
    margin-bottom: 60px;
  }
`;

const GoogleReviewTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;
const StyledText = styled(Text)`
  display: flex;
  gap: 3px;
  color: white;
  align-items: end;
  svg {
    margin-left: 10px;
  }
`;

const GoogleDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: 20px;
  align-items: center;

  @media screen and (max-width: 768px) {
    gap: 10px;
  }
`;
const StyledButton = styled(Button)`
  padding: 4px 16px;
  height: 32px;
  font-size: 14px;
  gap: 4px;

  @media screen and (max-width: 768px) {
    svg {
      width: 18px;
    }
    padding: 2px 10px;
    height: 28px;
    font-size: 12px;
    gap: 4px;
  }
`;
