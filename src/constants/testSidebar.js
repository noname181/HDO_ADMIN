export const sidebarData = [
  {
    menuId: 'dashboard',
    title: '대시보드',
    defaultIcon: '/assets/img/icon/icon-dashboard-d.png',
    activeIcon: '/assets/img/icon/icon-dashboard-a.png',
    children: null,
  },
  {
    menuId: 'affiliation',
    title: '소속 관리',
    defaultIcon: '/assets/img/icon/icon-users-d.png',
    activeIcon: '/assets/img/icon/icon-users-a.png',
    children: [
      {
        menuId: 'station',
        title: '주유소 관리',
        link: '/publishing/station',
      },
      {
        menuId: 'contractor',
        title: '협력사 관리',
        link: '/publishing/contractor',
      },
    ],
  },
  {
    menuId: 'user',
    title: '사용자 관리',
    defaultIcon: '/assets/img/icon/icon-users-d.png',
    activeIcon: '/assets/img/icon/icon-users-a.png',
    children: [
      {
        menuId: 'admin',
        title: '관리자',
        link: '/publishing/admin',
      },
      {
        menuId: 'mobile',
        title: '모바일 회원',
        link: '/publishing/mobile',
      },
    ],
  },
  {
    menuId: 'charger',
    title: '충전기 관리',
    defaultIcon: '/assets/img/icon/icon-nav-charger-d.png',
    activeIcon: '/assets/img/icon/icon-nav-charger-a.png',
    children: [
      {
        menuId: 'charging-station',
        title: '충전소 관리',
        link: '/publishing/charging-station',
      },
      {
        menuId: 'check-payment-detail',
        title: '결제/이용내역 조회',
        link: '/publishing/check-payment',
      },
      {
        menuId: 'check-payment-stats',
        title: '결제/이용내역 통계',
        link: '/publishing/check-payment-stats',
      },
      {
        menuId: 'charging-unit-price',
        title: '충전단가 관리',
        link: '/publishing/charging-unit-price',
      },
      {
        menuId: 'charger',
        title: '충전기 관리',
        link: '/publishing/charger',
      },
      {
        menuId: 'charger-model',
        title: '충전기 모델 관리',
        link: '/publishing/charger-model',
      },
      {
        menuId: 'firmware',
        title: '펌웨어 관리',
        link: '/publishing/firmware',
      },
    ],
  },
  {
    menuId: 'added-service',
    title: '부가서비스 관리',
    defaultIcon: '/assets/img/icon/icon-apps-d.png',
    activeIcon: '/assets/img/icon/icon-apps-a.png',
    children: [
      {
        menuId: 'PNC',
        title: 'PNC 관리',
        link: '/publishing/pnc',
      },
      {
        menuId: 'reservation',
        title: '예약 관리',
        link: '/publishing/reservation',
      },
      {
        menuId: 'added-service-product',
        title: '부가서비스 상품관리',
        link: '/publishing/added-service-product',
      },
      {
        menuId: 'bonus-card',
        title: '보너스카드 생성/내역',
        link: '/publishing/bonus-card',
      },
      {
        menuId: 'point',
        title: '포인트 내역',
        link: '/publishing/point',
      },
      {
        menuId: 'car-wash',
        title: '세차권 구매/사용내역',
        link: '/publishing/car-wash',
      },
      {
        menuId: 'coupon',
        title: '쿠폰발행/이용내역',
        link: '/publishing/coupon',
      },
      {
        menuId: 'added-service-stats',
        title: '부가서비스 통계',
        link: '/publishing/added-service-stats',
      },
    ],
  },
  {
    menuId: 'system',
    title: '시스템 관리',
    defaultIcon: '/assets/img/icon/icon-setting-web-d.png',
    activeIcon: '/assets/img/icon/icon-setting-web-a.png',
    children: [
      {
        menuId: 'pnc',
        title: '항목 관리',
        link: '/publishing/pnc',
      },
      {
        menuId: 'charging-data',
        title: '충전기 데이터 관리',
        link: '/publishing/charging-data',
      },
      {
        menuId: 'certificate',
        title: '인증서 관리',
        link: '/publishing/certificate',
      },
      {
        menuId: 'pg',
        title: 'PG사 관리',
        link: '/publishing/pg',
      },
      {
        menuId: 'etc',
        title: '기타',
        link: '/publishing/etc',
      },
    ],
  },
  {
    menuId: 'calculate',
    title: '정산',
    defaultIcon: '/assets/img/icon/icon-calculator-d.png',
    activeIcon: '/assets/img/icon/icon-calculator-a.png',
    children: [
      {
        menuId: 'revenue-charging',
        title: '매출 충전',
        link: '/publishing/revenue-charging',
      },
      {
        menuId: 'revenue-car-wash',
        title: '매출 세차권',
        link: '/publishing/revenue-car-wash',
      },
      {
        menuId: 'cost-charging',
        title: '비용 충전',
        link: '/publishing/cost-charging',
      },
      {
        menuId: 'cost-car-wash',
        title: '비용 세차권',
        link: '/publishing/cost-car-wash',
      },
    ],
  },
  {
    menuId: 'app',
    title: 'APP 관리',
    defaultIcon: '/assets/img/icon/icon-app-setting-d.png',
    activeIcon: '/assets/img/icon/icon-app-setting-a.png',
    children: [
      {
        menuId: 'notice',
        title: '공지사항',
        link: '/publishing/notice',
      },
      {
        menuId: 'faq',
        title: 'FAQ',
        link: '/publishing/faq',
      },
      {
        menuId: 'banner-event',
        title: '배너/이벤트',
        link: '/publishing/banner-event',
      },
    ],
  },
  {
    menuId: 'cs',
    title: '고객센터',
    defaultIcon: '/assets/img/icon/icon-customer-service-d.png',
    activeIcon: '/assets/img/icon/icon-customer-service-a.png',
    children: [
      {
        menuId: 'cs-list',
        title: '상담 목록',
        link: '/publishing/cs-list',
      },
      {
        menuId: 'cs-as',
        title: 'AS 내역보기',
        link: '/publishing/cs-as',
      },
      {
        menuId: 'cs-calculate',
        title: 'CS정산 내역보기',
        link: '/publishing/cs-calculate',
      },
      {
        menuId: 'cs-app',
        title: 'APP조치 내역보기',
        link: '/publishing/cs-app',
      },
      {
        menuId: 'cs-etc',
        title: '기타 내역보기',
        link: '/publishing/cs-etc',
      },
    ],
  },
];
