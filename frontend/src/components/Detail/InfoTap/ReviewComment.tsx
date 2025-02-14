import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Paragraph } from '@/components/common/typography/Paragraph';

export default function GoogleReviewComment({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const slice = isMobile ? 65 : 150;
  const truncatedText = text.length > 150 ? `${text.slice(0, slice)}...` : text;

  return (
    <Paragraph size="xs" weight="normal" variant="white">
      {isExpanded ? text : truncatedText}
      {text.length > 150 && !isExpanded && <MoreLink onClick={() => setIsExpanded(true)}>더보기</MoreLink>}
      {isExpanded && <MoreLink onClick={() => setIsExpanded(false)}>간략히</MoreLink>}
    </Paragraph>
  );
}
const MoreLink = styled.span`
  color: grey;
  cursor: pointer;
  margin-left: 5px;
  font-size: 14px;

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
