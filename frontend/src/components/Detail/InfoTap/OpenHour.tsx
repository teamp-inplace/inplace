import styled from 'styled-components';

import { Text } from '@/components/common/typography/Text';

import { OpenHourData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

interface Period {
  timeName: string;
  timeSE: string;
  dayOfWeek: string;
}

export default function OpenHour({ openHour }: { openHour: OpenHourData }) {
  const periodMap: { [key: string]: Period[] } = {};
  openHour.periodList.forEach((list: Period) => {
    if (!periodMap[list.dayOfWeek]) {
      periodMap[list.dayOfWeek] = [];
    }
    periodMap[list.dayOfWeek].push(list);
  });
  return (
    <Wrapper>
      {openHour.offdayList.length === 0 && openHour.periodList.length === 0 ? (
        <NoItem message="정보가 없습니다." height={0} logo={false} alignItems="start" />
      ) : (
        <>
          {Object.entries(periodMap).map(([day, periods]) => (
            <HourItem key={day}>
              <DayOfWeek>{day}</DayOfWeek>
              <TimeWrapper>
                {periods.map((period) => (
                  <TimeItem key={period.timeName}>
                    <Text size="xs" weight="normal" variant="white">
                      {period.timeSE}
                    </Text>
                    {period.timeName !== '영업시간' && (
                      <Text size="xs" weight="bold" variant="white">
                        {period.timeName}
                      </Text>
                    )}
                  </TimeItem>
                ))}
              </TimeWrapper>
            </HourItem>
          ))}
          {openHour.offdayList.map((list) => (
            <OffItem key={list.weekAndDay}>
              {list.temporaryHolidays === 'Y' && (
                <Text size="xs" weight="bold" variant="#ff2d2d">
                  임시{' '}
                </Text>
              )}
              <DayOfWeek>{list.holidayName}</DayOfWeek>
              <Text size="xs" weight="bold" variant="white">
                {list.weekAndDay}
              </Text>
            </OffItem>
          ))}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 10px 0px;
  padding: 20px;
  line-height: 170%;

  @media screen and (max-width: 768px) {
    line-height: 140%;
  }
`;

const HourItem = styled.div`
  display: flex;
  gap: 10px;

  @media screen and (max-width: 768px) {
    gap: 2px;
  }
`;
const DayOfWeek = styled.p`
  font-size: 16px;
  color: #dcdcdc;
  width: 50px;

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const OffItem = styled.div`
  margin: 10px 0px;
  display: flex;
  gap: 8px;

  @media screen and (max-width: 768px) {
    gap: 4px;
  }
`;
const TimeItem = styled.div`
  display: flex;
  gap: 6px;
`;
const TimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
