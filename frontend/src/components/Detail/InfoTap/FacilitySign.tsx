import { LuParkingCircle, LuParkingCircleOff, LuBaby } from 'react-icons/lu';
import { MdOutlinePets, MdSmokeFree, MdSmokingRooms } from 'react-icons/md';
import { TbDisabled } from 'react-icons/tb';
import styled from 'styled-components';
import { CiWifiOn, CiWifiOff } from 'react-icons/ci';
import { Paragraph } from '@/components/common/typography/Paragraph';
import { FacilityInfo } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

const facilities = {
  wifi: {
    icon: { Y: <CiWifiOn size={34} color="white" />, N: <CiWifiOff size={46} color="white" /> },
    label: 'WIFI',
  },
  parking: {
    icon: {
      Y: <LuParkingCircle size={60} color="white" strokeWidth={1} />,
      N: <LuParkingCircleOff size={60} color="white" strokeWidth={1} />,
    },
    label: '주차',
  },
  pet: {
    icon: { Y: <MdOutlinePets size={34} color="white" />, N: null },
    label: '동물출입',
  },
  forDisabled: {
    icon: { Y: <TbDisabled size={34} color="white" strokeWidth={1} />, N: null },
    label: '휠체어사용',
  },
  nursery: {
    icon: { Y: <LuBaby size={34} color="white" strokeWidth={1} />, N: null },
    label: '유아시설',
  },
  smokingRoom: {
    icon: { Y: <MdSmokingRooms size={34} color="white" />, N: <MdSmokeFree size={34} color="white" /> },
    label: '흡연실',
  },
};

export default function FacilitySign({ facilityInfo }: { facilityInfo: FacilityInfo }) {
  if (!facilityInfo) {
    return (
      <Wrapper>
        <NoItem message="정보가 없습니다." height={0} logo={false} alignItems="start" />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      {Object.keys(facilityInfo).includes('message') ? (
        <NoItem message="정보가 없습니다." height={0} logo={false} alignItems="start" />
      ) : (
        <>
          {Object.entries(facilities).map(([key, { icon, label }]) => {
            const facilityStatus = facilityInfo[key as keyof FacilityInfo];

            let iconElement = null;
            switch (facilityStatus) {
              case 'Y':
                iconElement = icon.Y;
                break;
              case 'N':
                iconElement = icon.N;
                break;
              default:
                iconElement = null;
            }

            if (iconElement === null) return null;

            return (
              <SignWrapper key={key} $isParking={key === 'parking'}>
                {key === 'parking' ? iconElement : <Sign>{iconElement}</Sign>}
                <Paragraph size="xs" weight="normal" variant="white">
                  {label}
                </Paragraph>
              </SignWrapper>
            );
          })}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 18px;
  padding: 0px 20px;

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    gap: 6px;
    padding: 0px 6px;
  }
`;

const Sign = styled.div`
  border: 3px solid white;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    border: 2px solid white;

    svg {
      width: 30px;
    }
  }
`;

const SignWrapper = styled.div<{ $isParking: boolean }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 12px;
  align-items: center;

  @media screen and (max-width: 768px) {
    gap: ${({ $isParking }) => ($isParking ? '4px' : '8px')};
    svg {
      width: ${({ $isParking }) => ($isParking ? '50px' : null)};
      margin-top: ${({ $isParking }) => ($isParking ? '-4px' : null)};
    }
  }
`;
