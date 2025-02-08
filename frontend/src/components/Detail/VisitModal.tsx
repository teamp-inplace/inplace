import styled from 'styled-components';

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@/components/common/Button';
import InfoTalkIcon from '@/assets/images/infotalk.png';
import { Paragraph } from '@/components/common/typography/Paragraph';
import { useGetSendInfo } from '@/api/hooks/useGetSendInfo';
import useAuth from '@/hooks/useAuth';
import LoginModal from '../common/modals/LoginModal';

export default function VisitModal({ id, placeName, onClose }: { id: number; placeName: string; onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSend, setIsSend] = useState(false);
  const { refetch } = useGetSendInfo(String(id), isSend);
  const [message, setMessage] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
  const handleSendInfo = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setMessage('로그인이 필요합니다.');
      return;
    }
    try {
      setIsSend(true);
      const { status } = await refetch();
      if (status === 'success') {
        setMessage('카카오톡을 확인해주세요!');
      } else {
        setMessage('에러가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setMessage('에러가 발생했습니다. 관리자에게 문의하세요.');
    } finally {
      setIsSend(false);
    }
  };
  const buttonStyle = {
    fontWeight: 'bold',
    width: isMobile ? '46%' : '170px',
    height: isMobile ? '40px' : '46px',
    fontSize: isMobile ? '16px' : '18px',
  };
  return (
    <>
      <Overlay onClick={() => onClose()}>
        <Wrapper onClick={handleModalClick}>
          <DescriptionSection>
            <img src={InfoTalkIcon} alt="정보 카카오톡 아이콘" />
            <Paragraph size="l" weight="normal">
              {message || `${placeName}에 대한 정보를\n 카카오톡으로 보내드릴까요?`}
            </Paragraph>
          </DescriptionSection>
          <BtnContainer $hasMessage={!!message}>
            {message ? (
              <Button aria-label="complete_btn" variant="kakao" style={buttonStyle} onClick={() => onClose()}>
                완료
              </Button>
            ) : (
              <>
                <Button aria-label="cancel_btn" variant="blackOutline" style={buttonStyle} onClick={() => onClose()}>
                  취소
                </Button>
                <Button aria-label="check_btn" variant="kakao" style={buttonStyle} onClick={handleSendInfo}>
                  확인
                </Button>
              </>
            )}
          </BtnContainer>
        </Wrapper>
      </Overlay>
      {showLoginModal && <LoginModal currentPath={location.pathname} onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;
const Wrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 440px;
  height: 540px;
  border-radius: 8px;
  background-color: white;
  border: 30px solid #e8f9ff;

  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 60px;

  @media screen and (max-width: 768px) {
    width: calc(90% - 48px);
    height: 402px;
    border: 24px solid #e8f9ff;
  }
`;
const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 16%;

  img {
    width: 180px;
    height: 180px;
  }

  p {
    line-height: 180%;
    white-space: pre-line;
  }

  @media screen and (max-width: 768px) {
    img {
      width: 130px;
      height: 130px;
    }
    p {
      font-size: 14px;
    }
  }
`;
const BtnContainer = styled.div<{ $hasMessage: boolean }>`
  display: flex;
  justify-content: ${({ $hasMessage }) => ($hasMessage ? 'center' : 'space-between')};
  width: 382px;
  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;
