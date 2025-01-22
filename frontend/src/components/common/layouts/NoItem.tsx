import styled from 'styled-components';
import Logo from '@/assets/images/Logo.svg';
import { Paragraph } from '../typography/Paragraph';

interface NoItemsMessageProps {
  message?: string;
  height?: number;
  logo?: boolean;
  alignItems?: string;
}

function NoItem({ message = '데이터가 없습니다!', height, logo = true, alignItems }: NoItemsMessageProps) {
  return (
    <MessageContainer height={height}>
      <TextWrapper alignItems={alignItems}>
        {logo && <LogoImage src={Logo} alt="인플레이스 로고" />}
        <Paragraph size="xs" weight="normal" variant="white">
          {message}
        </Paragraph>
      </TextWrapper>
    </MessageContainer>
  );
}

const MessageContainer = styled.div<{ height?: number }>`
  width: 100%;
  margin: 20px 0;
  align-content: center;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;
const TextWrapper = styled.div<{ alignItems?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems || 'center'};
  gap: 20px;
  white-space: pre-line;
  line-height: 26px;

  @media screen and (max-width: 768px) {
    gap: 10px;
  }
`;
const LogoImage = styled.img`
  height: 80px;

  @media screen and (max-width: 768px) {
    height: 60px;
  }
`;
export default NoItem;
