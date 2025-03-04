import { useContext, useState } from 'react';
import styled from 'styled-components';
import { FaComment, FaMapMarkedAlt, FaTimes } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/common/Button';
import { ThemeContext } from '@/provider/Themes';

interface SpeedDialMapProps {
  kakaoPlaceUrl: string;
  naverPlaceUrl: string;
  googlePlaceUrl?: string;
}

export default function SpeedDialMap({ kakaoPlaceUrl, googlePlaceUrl, naverPlaceUrl }: SpeedDialMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const buttonVariant = theme === 'dark' ? 'outline' : 'blackOutline';

  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SpeedDialContainer>
      <SpeedDialItems isOpen={isOpen}>
        <KakaoButton
          aria-label="kakao_btn"
          variant="white"
          onClick={() => {
            window.location.href = kakaoPlaceUrl;
          }}
          data-tooltip="카카오맵"
        >
          <FaComment size={18} color="fee500" />
        </KakaoButton>

        <NaverButton
          aria-label="naver_btn"
          variant="white"
          onClick={() => {
            window.location.href = naverPlaceUrl;
          }}
          data-tooltip="네이버맵"
        >
          <SiNaver size={14} color="green" />
        </NaverButton>

        {googlePlaceUrl && (
          <GoogleButton
            aria-label="google_btn"
            variant="white"
            onClick={() => {
              window.location.href = googlePlaceUrl;
            }}
            data-tooltip="구글맵"
          >
            <FcGoogle size={20} />
          </GoogleButton>
        )}
      </SpeedDialItems>

      <MainButton aria-label="toggle_map_options" variant={buttonVariant} onClick={toggleSpeedDial}>
        {isOpen ? <FaTimes size={24} /> : <FaMapMarkedAlt size={24} />}
      </MainButton>
    </SpeedDialContainer>
  );
}

const SpeedDialContainer = styled.div`
  position: fixed;
  bottom: 4%;
  right: 17%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  z-index: 2;

  @media screen and (max-width: 768px) {
    bottom: 4%;
    right: 2%;
  }
`;

const MainButton = styled(Button)`
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 0;

  &[variant='blackOutline'] {
    background-color: #ecfbfb;
  }
  &[variant='outline'] {
    background-color: #292929;
  }

  @media screen and (max-width: 768px) {
    width: 48px;
    height: 48px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const SpeedDialItems = styled.div<{ isOpen: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  & > * {
    position: absolute;
    transition: transform 0.3s ease;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  }

  & > *:nth-child(1) {
    transform: ${(props) => (props.isOpen ? 'translateY(-190%)' : 'translateY(0)')};
  }

  & > *:nth-child(2) {
    transform: ${(props) => (props.isOpen ? 'translateY(-320%)' : 'translateY(0)')};
  }

  & > *:nth-child(3) {
    transform: ${(props) => (props.isOpen ? 'translateY(-450%)' : 'translateY(0)')};
  }
`;

const SpeedDialItem = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: white !important;
  }
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
  }
  &:hover::after {
    opacity: 1;
    visibility: visible;
  }

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const KakaoButton = styled(SpeedDialItem)`
  @media screen and (max-width: 768px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const NaverButton = styled(SpeedDialItem)`
  @media screen and (max-width: 768px) {
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const GoogleButton = styled(SpeedDialItem)`
  @media screen and (max-width: 768px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;
