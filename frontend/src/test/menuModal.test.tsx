import { render, screen, fireEvent } from '@testing-library/react';
import InfoTap from '@/components/Detail/InfoTap';

test('메뉴 이미지 클릭시 모달창이 뜨는지 확인', async () => {
  const mockFacilityInfo = {
    wifi: 'Y',
    pet: 'N',
  };
  const mockOpenHour = {
    periodList: [
      {
        timeName: '영업시간',
        timeSE: '10:00 ~ 20:00',
        dayOfWeek: '매일',
      },
    ],
    offdayList: [
      {
        holidayName: '휴무일',
        weekAndDay: '토',
        temporaryHolidays: 'Y',
      },
    ],
  };
  const mockMenuInfos = {
    menuImgUrls: [
      'https://via.placeholder.com/500',
      'https://via.placeholder.com/600',
      'https://via.placeholder.com/700',
    ],
    menuList: [
      {
        price: '3,020',
        recommend: false,
        menuName: '리조또',
        menuImgUrl: '',
        description: '국내산 돼지 안심을 료코만의 방식으로 숙성 및 조리하여 육즙과 부드러움의 특징을 살린 메뉴',
      },
    ],
    menuUpdatedAt: new Date('2024-10-01T12:00:00Z'),
  };
  const mockLongitude = '126.570667';
  const mockLatitude = '33.450701';
  render(
    <InfoTap
      facilityInfo={mockFacilityInfo}
      openHour={mockOpenHour}
      menuInfos={mockMenuInfos}
      longitude={mockLongitude}
      latitude={mockLatitude}
    />,
  );

  const menuImage = screen.getByRole('img', { name: 'Menu Image 1' });
  expect(menuImage).toBeInTheDocument();
  fireEvent.click(menuImage);

  const modal = await screen.findByRole('dialog');
  expect(modal).toBeInTheDocument();
});
