import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FallbackImage from '@/components/common/Items/FallbackImage';
import { Text } from '@/components/common/typography/Text';
import { MarkerData } from '@/types';

type Props = {
  data: MarkerData; // 임시
  onClose: () => void;
};
export default function InfoWindow({ data, onClose }: Props) {
  return (
    <Wrapper>
      <Text size="m" weight="bold">
        료코{data.placeId}
      </Text>
      <Info>
        <Img>
          <FallbackImage src="" alt="" />
        </Img>
        <TextInfo>
          <Text size="xs" weight="normal">
            경상북도 경주시 달서구 더길게
          </Text>
          <Text size="xs" weight="normal">
            월~금 10:00 ~ 22:00
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
  width: 300px;
  height: 130px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 1px 1px 1px #b3b3b3;
`;
const Img = styled.div`
  width: 35%;
`;
const CloseBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 26px;
  background: none;
  color: #818181;
  border: none;
  cursor: 'pointer';
`;
const Info = styled.div`
  display: flex;
  gap: 10px;
`;
const TextInfo = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 0px;
  color: #4d4d4d;
  text-overflow: ellipsis;
  span {
    font-size: 14px;
  }
  a {
    color: black;
    text-decoration-line: underline;
    font-size: 14px;
  }
  a:visited {
    color: black;
  }
`;
