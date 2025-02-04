import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AxiosError } from 'axios';
import Logo from '@/assets/images/Logo.svg';
import Button from '../Button';
import { Paragraph } from '../typography/Paragraph';

type FallbackProps = {
  error?: unknown | AxiosError | Error;
  resetErrorBoundary: () => void;
};
export default function ErrorComponent({ error, resetErrorBoundary }: FallbackProps) {
  const location = useLocation();
  const errorLocation = useRef(location.pathname);

  const handleRetry = () => {
    resetErrorBoundary();
  };
  const getMessage = () => {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 400:
          return {
            title: '잘못된 요청 🥲',
            description: '입력한 정보가 올바른지 확인하고 다시 시도해주세요.',
          };
        case 401:
          return {
            title: '로그인이 필요해요 🥲',
            description: '로그인 후 다시 시도해주세요.',
          };
        case 403:
          return {
            title: '접근 권한이 없어요 🥲',
            description: '이 페이지를 볼 수 있는 권한이 없어요.',
          };
        case 404:
          return {
            title: '페이지를 찾을 수 없어요 🥲',
            description: '요청한 페이지가 존재하지 않거나 삭제되었어요.',
          };
        case 500:
          return {
            title: '서버 오류 발생 🥲',
            description: '현재 서버에 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
          };
        default:
          return {
            title: `오류 발생 🥲`,
            description: '예기치 않은 오류가 발생했어요다.\n 다시 시도해주세요.',
          };
      }
    }
    // Query, 일반 JS 오류
    if (error instanceof Error) {
      return {
        title: '데이터 로딩 실패 🥲',
        description: '오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      };
    }
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
      <StyledButton aria-label="retry-btn" variant="outline" size="large" onClick={handleRetry}>
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
  gap: 60px;

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
  width: 150px;

  @media screen and (max-width: 768px) {
    height: 100px;
    width: 100px;
  }
`;

const StyledButton = styled(Button)`
  width: 40%;

  @media screen and (max-width: 768px) {
    width: fit-content;
    padding: 20px;
  }
`;
