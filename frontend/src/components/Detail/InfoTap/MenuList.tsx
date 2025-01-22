import styled from 'styled-components';

import { Paragraph } from '@/components/common/typography/Paragraph';

import { Menu } from '@/types';
import { Text } from '@/components/common/typography/Text';
import NoItem from '@/components/common/layouts/NoItem';

export default function MenuList({ lists }: { lists: Menu[] }) {
  return (
    <Wrapper>
      {lists.length === 0 ? (
        <NoItem message="메뉴 정보가 없습니다." height={100} logo={false} alignItems="start" />
      ) : (
        <>
          {lists.map((list) => (
            <MenuItem key={list.menuName}>
              {list.menuImgUrl && <MenuImage src={list.menuImgUrl} alt={list.menuName} />}
              <MenuContent>
                <Text size="s" weight="normal" variant="white">
                  {list.menuName}
                </Text>
                {list.recommend && (
                  <Text size="s" weight="bold" variant="mint">
                    {` Pick !`}
                  </Text>
                )}
                <Paragraph size="xs" weight="bold" variant="white">
                  {list.price}
                </Paragraph>
                <Paragraph size="xs" weight="normal" variant="white">
                  {list.description}
                </Paragraph>
              </MenuContent>
            </MenuItem>
          ))}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 10px 0px;
`;

const MenuItem = styled.div`
  padding-top: 30px;
  display: flex;
  gap: 14px;
`;

const MenuImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 10px;

  @media screen and (max-width: 768px) {
    width: 20%;
    aspect-ratio: 1/1;
    height: auto;
    border-radius: 6px;
  }
`;
const MenuContent = styled.div`
  line-height: 140%;

  @media screen and (max-width: 768px) {
    width: 80%;
    line-height: 120%;
  }
`;
