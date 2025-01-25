import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RiMenuLine } from 'react-icons/ri';
import { motion, Variants } from 'framer-motion';
import LoginModal from '@/components/common/modals/LoginModal';
import { Text } from '@/components/common/typography/Text';
import Logo from '@/assets/images/Logo.svg';
import useAuth from '@/hooks/useAuth';

const navVariants: Variants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      staggerChildren: 0.1,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -20 },
};

export default function Header() {
  const { isAuthenticated, handleLogout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <RiMenuLine size={24} color="white" />
      </MobileMenuButton>
      <LogoLink to="/">
        <LogoContainer>
          <LogoImage src={Logo} alt="인플레이스 로고" />
          <Text size="l" weight="bold" variant="mint">
            인플레이스
          </Text>
        </LogoContainer>
      </LogoLink>
      <DesktopNav>
        {isAuthenticated ? (
          <>
            <NavItem to="/map">
              <Text size="xs" variant="white" weight="normal">
                지도
              </Text>
            </NavItem>
            <NavItem to="/influencer">
              <Text size="xs" variant="white" weight="normal">
                인플루언서
              </Text>
            </NavItem>
            <NavItem to="/my">
              <Text size="xs" variant="white" weight="normal">
                마이페이지
              </Text>
            </NavItem>
            <LoginButton onClick={handleLogout}>
              <Text size="xs" variant="white" weight="normal">
                로그아웃
              </Text>
            </LoginButton>
          </>
        ) : (
          <>
            <NavItem to="/map">
              <Text size="xs" variant="white" weight="normal">
                지도
              </Text>
            </NavItem>
            <NavItem to="/influencer">
              <Text size="xs" variant="white" weight="normal">
                인플루언서
              </Text>
            </NavItem>
            <LoginModal currentPath={location.pathname}>
              {(openModal: () => void) => (
                <LoginButton onClick={openModal}>
                  <Text size="xs" variant="white" weight="normal">
                    로그인
                  </Text>
                </LoginButton>
              )}
            </LoginModal>
          </>
        )}
      </DesktopNav>
      <MobileNav
        as={motion.nav}
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={navVariants}
        $isOpen={isMenuOpen}
      >
        <MenuContainer variants={itemVariants}>
          {isAuthenticated ? (
            <>
              <MobileNavItem to="/map" onClick={() => setIsMenuOpen(false)}>
                <Text size="xs" variant="white" weight="normal">
                  지도
                </Text>
              </MobileNavItem>
              <MobileNavItem to="/influencer" onClick={() => setIsMenuOpen(false)}>
                <Text size="xs" variant="white" weight="normal">
                  인플루언서
                </Text>
              </MobileNavItem>
              <MobileNavItem to="/my" onClick={() => setIsMenuOpen(false)}>
                <Text size="xs" variant="white" weight="normal">
                  마이페이지
                </Text>
              </MobileNavItem>
              <MobileLoginButton
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <Text size="xs" variant="white" weight="normal">
                  로그아웃
                </Text>
              </MobileLoginButton>
            </>
          ) : (
            <>
              <MobileNavItem to="/map" onClick={() => setIsMenuOpen(false)}>
                <Text size="xs" variant="white" weight="normal">
                  지도
                </Text>
              </MobileNavItem>
              <MobileNavItem to="/influencer" onClick={() => setIsMenuOpen(false)}>
                <Text size="xs" variant="white" weight="normal">
                  인플루언서
                </Text>
              </MobileNavItem>
              <LoginModal currentPath={location.pathname}>
                {(openModal: () => void) => (
                  <MobileLoginButton
                    onClick={() => {
                      openModal();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text size="xs" variant="white" weight="normal">
                      로그인
                    </Text>
                  </MobileLoginButton>
                )}
              </LoginModal>
            </>
          )}
        </MenuContainer>
      </MobileNav>
    </HeaderContainer>
  );
}

export const HEADER_HEIGHT = 80;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px;
  height: 80px;
  box-sizing: border-box;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    position: absolute;
    right: 5%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 22px;
  margin-right: 10px;
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled(motion.nav)<{ $isOpen: boolean }>`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background-color: rgba(41, 41, 41, 0.9);
    padding: 20px 0;
    gap: 20px;
    z-index: 10;
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  }
`;

const NavItem = styled(Link)`
  margin-left: 20px;
  text-decoration: none;
  cursor: pointer;
`;

const MobileNavItem = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`;

const LoginButton = styled.div`
  margin-left: 20px;
  color: white;
  cursor: pointer;
`;

const MobileLoginButton = styled.div`
  color: white;
  cursor: pointer;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    left: 5%;
    height: 22px;
  }
`;

const MenuContainer = styled(motion.div)`
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
  }
`;
