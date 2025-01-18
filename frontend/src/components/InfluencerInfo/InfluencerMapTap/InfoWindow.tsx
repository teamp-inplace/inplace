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
            경상북도 경주시 달서구 45
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
  width: 280px;
  background-color: white;
  padding: 30px;
  border-radius: 4px;
`;
const Img = styled.div`
  width: 40%;
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
`;
const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 0px;
  color: #4d4d4d;
  a {
    color: black;
    text-decoration-line: underline;
  }
  a:visited {
    color: black;
  }
`;
