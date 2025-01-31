import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '@/assets/images/Logo.svg';
import Button from '../Button';
import { Paragraph } from '../typography/Paragraph';

type FallbackProps = {
  error?: Error;
  resetErrorBoundary: () => void;
};
export default function Error({ error, resetErrorBoundary }: FallbackProps) {
  const location = useLocation();
  const errorLocation = useRef(location.pathname);

  const handleRetry = () => {
    resetErrorBoundary();
  };
  const getMessage = () => {
    if (error?.name === 'AxiosError') {
      return {
        title: '일시적인 오류가 발생했어요 🥲',
        description: `서버와의 통신 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.`,
      };
    }
    // React Query 에러인 경우
    if (error?.name === 'QueryError') {
      return {
        title: '데이터를 불러오는데 실패했어요 🥲',
        description: `데이터를 가져오는 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.`,
      };
    }
    // 기본 에러 메시지
    return {
      title: '앗, 여기는 정보가 없는 것 같아요 🥲',
      description: `오류가 발생했어요.\n문제를 해결하기 위해 열심히 노력중입니다!\n잠시 후 다시 시도해주세요.`,
    };
  };

  const message = getMessage();

  useEffect(() => {
    if (location.pathname !== errorLocation.current) {
      resetErrorBoundary();
    }
  }, [location.pathname]);

  return (
    <Wrapper>
      <TextWrapper>
        <LogoImage src={Logo} alt="인플레이스 로고" />
        <Paragraph size="xl" weight="bold" variant="white">
          {message.title}
        </Paragraph>
        <Paragraph size="m" weight="normal" variant="#bdbdbd">
          {message.description}
        </Paragraph>
      </TextWrapper>
      <StyledButton variant="outline" size="large" onClick={handleRetry}>
        다시 시도하기
      </StyledButton>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 40px;
  gap: 80px;

  @media screen and (max-width: 768px) {
    gap: 40px;
    padding-bottom: 0px;
  }
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  white-space: pre-line;
  line-height: 26px;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
const LogoImage = styled.img`
  height: 180px;

  @media screen and (max-width: 768px) {
    height: 100px;
  }
`;

const StyledButton = styled(Button)`
  width: 40%;

  @media screen and (max-width: 768px) {
    width: fit-content;
    padding: 20px;
  }
`;
