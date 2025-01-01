import styled from 'styled-components';

import { FaGithub } from 'react-icons/fa';
import { Text } from '@/components/common/typography/Text';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterSection>
        <FooterInfo>
          <CompanyInfo>
            <Text size="xxs" weight="normal" variant="#979797">
              (주) 쿠키 7개입
            </Text>
            <Text size="xxs" weight="normal" variant="#979797">
              Copyright 2024. sevenKookies Co.,Ltd. All rights reserved
            </Text>
            <Text size="xxs" weight="normal" variant="#979797">
              주소 : 대구광역시 북구 대학로 80
            </Text>
            <Text size="xxs" weight="normal" variant="#979797">
              문의전화 : (053)123-12345 | 이메일 : inplace.kakao@gmail.com
            </Text>
            <Text size="xxs" weight="normal" variant="#979797">
              대표전화 : (053)777-7777 | FAX : (053)123-4567
            </Text>
          </CompanyInfo>
          <SocialLinks>
            <SocialNavItem
              href="https://github.com/kakao-tech-campus-2nd-step3/Team7_FE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={16} color="white" />
              <Text size="xxs" weight="normal" variant="white">
                FE Github
              </Text>
            </SocialNavItem>
            <SocialNavItem
              href="https://github.com/kakao-tech-campus-2nd-step3/Team7_BE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={16} color="white" />
              <Text size="xxs" weight="normal" variant="white">
                BE Github
              </Text>
            </SocialNavItem>
          </SocialLinks>
        </FooterInfo>
      </FooterSection>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background: #2f2f2f;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FooterInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialNavItem = styled.a`
  line-height: 24px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;
