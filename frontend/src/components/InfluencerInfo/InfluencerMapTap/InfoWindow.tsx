import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FallbackImage from '@/components/common/Items/FallbackImage';
import { Text } from '@/components/common/typography/Text';
import { AddressInfo, MarkerInfo, PlaceData } from '@/types';

type Props = {
  data: MarkerInfo | PlaceData;
  onClose: () => void;
};

const getFullAddress = (addr: AddressInfo) => {
  return [addr.address1, addr.address2, addr.address3].filter(Boolean).join(' ');
};

export default function InfoWindow({ data, onClose }: Props) {
  const isLongName = data.placeName.length > 20;

  return (
    <Wrapper>
      <Title>
        <Text size="xs" weight="bold" className="title">
          {data.placeName}
        </Text>
        {!isLongName && (
          <Text size="xxs" weight="normal" variant="grey">
            {data.category}
          </Text>
        )}
      </Title>
      <Info>
        <Img>
          <FallbackImage src={data.menuImgUrl} alt={data.placeName} />
        </Img>
        <TextInfo>
          <Text size="xs" weight="normal">
            {data.address ? getFullAddress(data.address) : '주소 정보가 없습니다'}
          </Text>
          <Text size="xs" weight="normal">
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
  margin-left: -124px;
  width: 260px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 1px #b3b3b3;

  @media screen and (max-width: 768px) {
    width: 200px;
    margin-left: -100px;
    bottom: 40px;
  }
`;
const Title = styled.div`
  width: 100%;
  padding: 12px;
  display: flex;
  gap: 6px;
  align-items: end;
  background-color: #ecfdff;
  box-sizing: border-box;

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
`;
const CloseBtn = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  font-size: 18px;
  background: none;
  color: #818181;
  border: none;
  cursor: 'pointer';

  @media screen and (max-width: 768px) {
    right: 4px;
    font-size: 14px;
  }
`;
const Info = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 6px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 768px) {
    padding: 4px;
    gap: 0px;
  }
`;
const Img = styled.div`
  width: 30%;
  aspect-ratio: 1;
  height: auto;
`;
const TextInfo = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* padding: 14px 0px; */
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

  @media screen and (max-width: 768px) {
    padding: 8px 0px;
    gap: 4px;
  }
`;
