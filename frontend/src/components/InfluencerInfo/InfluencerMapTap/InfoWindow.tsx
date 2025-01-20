import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FallbackImage from '@/components/common/Items/FallbackImage';
import { Text } from '@/components/common/typography/Text';
import { AddressInfo, MarkerInfo, PlaceData } from '@/types';

type Props = {
  data: MarkerInfo | PlaceData;
  onClose: () => void;
};

const categoryMapping = {
  RESTAURANT: '음식점',
  CAFE: '카페',
  JAPANESE: '일식',
  KOREAN: '한식',
  WESTERN: '양식',
} as const;

const getFullAddress = (addr: AddressInfo) => {
  return [addr.address1, addr.address2, addr.address3].filter(Boolean).join(' ');
};

export default function InfoWindow({ data, onClose }: Props) {
  const translatedCategory = categoryMapping[data.category as keyof typeof categoryMapping] || '기타';
  return (
    <Wrapper>
      <Title>
        <Text size="xs" weight="bold">
          {data.placeName}
        </Text>
        <Text size="14px" weight="normal" variant="grey">
          {translatedCategory}
        </Text>
      </Title>
      <Info>
        <Img>
          <FallbackImage src={data.menuImgUrl} alt={data.placeName} />
        </Img>
        <TextInfo>
          <Text size="14px" weight="normal">
            {data.address ? getFullAddress(data.address) : '주소 정보가 없습니다'}
          </Text>
          <Text size="14px" weight="normal">
            {data.influencerName}
          </Text>
          <Link to={`/detail/${data.placeId}`}>상세보기</Link>
        </TextInfo>
      </Info>
      <CloseBtn onClick={() => onClose()}>x</CloseBtn>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  margin-left: -144px;
  width: 260px;
  height: 130px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 1px 1px 1px #b3b3b3;
`;
const Title = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  gap: 6px;
  align-items: end;
  background-color: #ecfdff;
  box-sizing: border-box;
`;
const Img = styled.div`
  width: 30%;
  aspect-ratio: 1/1;
`;
const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  font-size: 18px;
  background: none;
  color: #818181;
  border: none;
  cursor: 'pointer';
`;
const Info = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 4px;
  box-sizing: border-box;
`;
const TextInfo = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 0px;
  color: #4d4d4d;
  overflow: hidden;
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a {
    color: black;
    text-decoration-line: underline;
    font-size: 12px;
  }
  a:visited {
    color: black;
  }
`;
