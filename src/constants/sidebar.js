// status: error-fe, error-be, complete-fe, complete-be, doing-fe, doing-be
export const sidebarData = [
  {
    menuId: 'dashboard',
    title: '대시보드',
    defaultIcon: '/assets/img/icon/icon-dashboard-d.png',
    activeIcon: '/assets/img/icon/icon-dashboard-a.png',
    children: null,
    link: '/',
    status: {
      fe: 'not-started',
      be: 'not-started',
    },
  },
  {
    menuId: 'master',
    title: '시스템설정',
    defaultIcon: '/assets/img/icon/master_black.png',
    activeIcon: '/assets/img/icon/master_white.png',
    // link: '/codelookup',
    children: [
      {
        menuId: 'codelookup',
        title: '공통코드 관리',
        link: '/codelookup',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'parameter',
        title: 'Parameter 관리',
        link: '/parameter',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      // {
      //   menuId: 'errorcode',
      //   title: 'Errorcode 조회',
      //   link: '/error-code',
      // },
      {
        menuId: 'charger-model',
        title: '충전기 모델 관리',
        link: '/charger-model',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'update-file',
        title: '충전기 전송파일 관리',
        link: '/update-file',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'permission-admin',
        title: '권한관리',
        link: '/permission-admin',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
    ],
  },
  {
    menuId: 'affiliation',
    title: '소속',
    defaultIcon: '/assets/img/icon/affiliation_black.png',
    activeIcon: '/assets/img/icon/affiliation_white.png',
    // link: '/station',
    children: [
      {
        menuId: 'station',
        title: '사업장 관리',
        link: '/station',
      },
      {
        menuId: 'contractor',
        title: '협력사 관리',
        link: '/contractor',
      },
      {
        menuId: 'client',
        title: '고객사 관리',
        link: '/client',
      },
    ],
  },
  {
    menuId: 'user',
    title: '사용자',
    defaultIcon: '/assets/img/icon/user_black.png',
    activeIcon: '/assets/img/icon/user_white.png',
    // link: '/mobile-user',
    children: [
      {
        menuId: 'mobile-user',
        title: '모바일 회원',
        link: '/mobile-user',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'admin',
        title: 'HDO 관리자',
        link: '/admin',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'external-admin',
        title: '외부 관리자',
        link: '/external-admin',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
    ],
  },
  {
    menuId: 'charger',
    title: '충전기',
    defaultIcon: '/assets/img/icon/icon-nav-charger-d.png',
    activeIcon: '/assets/img/icon/icon-nav-charger-a.png',
    // link: '/payment-history',
    children: [
      // {
      //   menuId: 'payment-history',
      //   title: '내역조회',
      //   link: '/payment-history',
      //   status: 'doing',
      // },
      {
        menuId: 'charging-station',
        title: '충전소',
        link: '/charging-station',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'charger',
        title: '충전기 관리',
        link: '/charger',
      },
      // {
      //   menuId: 'reservation',
      //   title: '예약내역',
      //   link: '/reservation',
      // },

      // {
      //   menuId: 'charger-status',
      //   title: '충전기 현황',
      //   link: '/charger-status',
      //   status: 'doing',
      // },

      // {
      //   menuId: 'charging-unit-price',
      //   title: '단가테이블',
      //   link: '/charging-unit-price',
      //   status: {
      //     fe: 'complete',
      //     be: 'complete',
      //   },
      // },
      {
        menuId: 'charger-update',
        title: '충전기 업데이트',
        link: '/charger-update',
      },
      {
        menuId: 'trouble-report',
        title: '고장 신고 관리',
        link: '/trouble-report',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      // {
      //   menuId: 'charging-payment',
      //   title: '충전 결제 내역',
      //   link: '/charger-payment',
      //   status: 'doing',
      // },
      // {
      //   menuId: 'unexported-payment',
      //   title: '미출차 결제 내역',
      //   link: '/unexported-payment',
      //   status: 'doing',
      // },
    ],
  },
  {
    menuId: 'history',
    title: '내역관리',
    defaultIcon: '/assets/img/icon/history_black.png',
    activeIcon: '/assets/img/icon/history_white.png',
    // link: '/payment-history',
    children: [
      {
        menuId: 'charger-history',
        title: '충전내역',
        link: '/charger-history',
      },
      {
        menuId: 'payment-history',
        title: '충전 결제 내역',
        link: '/payment-history',
      },
      {
        menuId: 'payment-details',
        title: '결제내역',
        link: '/payment-details',
      },
      {
        menuId: 'outstanding-payment',
        title: '미결제 내역',
        link: '/outstanding-payment',
      },
      // {
      //   menuId: 'reservation',
      //   title: '예약내역',
      //   link: '/reservation',
      // },
    ],
  },
  {
    menuId: 'calculate',
    title: '정산',
    defaultIcon: '/assets/img/icon/calculate_black.png',
    activeIcon: '/assets/img/icon/calculate_white.png',
    children: [
      {
        menuId: 'settlement',
        title: '일매출관리',
        link: '/settlement',
        status: {
          fe: 'doing',
          be: 'doing',
        },
      },
      {
        menuId: 'daily-payment',
        title: '일수금관리',
        link: '/daily-payment',
        status: {
          fe: 'doing',
          be: 'doing',
        },
      },
      {
        menuId: 'monthly-settlement',
        title: '월정산관리',
        link: '/monthly-settlement',
        status: {
          fe: 'doing',
          be: 'doing',
        },
      },
    ],
  },
  // {
  //   menuId: 'added-service',
  //   title: '상품권',
  //   defaultIcon: '/assets/img/icon/icon-apps-d.png',
  //   activeIcon: '/assets/img/icon/icon-apps-a.png',
  //   // link: '/bonus-card',
  //   children: [
  //     // {
  //     //   menuId: 'PNC',
  //     //   title: 'PNC 관리',
  //     //   link: '/pnc',
  //     // },
  //     // {
  //     //   menuId: 'added-service-product',
  //     //   title: '부가서비스 상품관리',
  //     //   link: '/added-service-product',
  //     //   status: 'doing',
  //     // },
  //     {
  //       menuId: 'bonus-card',
  //       title: '멤버쉽',
  //       link: '/bonus-card',
  //     },
  //     {
  //       menuId: 'point',
  //       title: '포인트',
  //       link: '/point',
  //     },
  //     {
  //       menuId: 'car-wash',
  //       title: '세차권',
  //       link: '/car-wash',
  //       status: {
  //         fe: 'complete',
  //         be: 'complete',
  //       },
  //     },
  //     {
  //       menuId: 'coupon',
  //       title: '쿠폰',
  //       link: '/coupon',
  //       status: {
  //         fe: 'complete',
  //         be: 'complete',
  //       },
  //     },
  //     {
  //       menuId: 'added-service-stats',
  //       title: '통계',
  //       link: '/added-service-stats',
  //     },
  //   ],
  // },

  // {
  //   menuId: 'calculate',
  //   title: '정산',
  //   defaultIcon: '/assets/img/icon/icon-calculator-d.png',
  //   activeIcon: '/assets/img/icon/icon-calculator-a.png',
  //   children: [
  //     {
  //       menuId: 'revenue-charging',
  //       title: '매출 충전',
  //       link: '/revenue-charging',
  //     },
  //     {
  //       menuId: 'revenue-car-wash',
  //       title: '매출 세차권',
  //       link: '/revenue-car-wash',
  //     },
  //     {
  //       menuId: 'cost-charging',
  //       title: '비용 충전',
  //       link: '/cost-charging',
  //     },
  //     {
  //       menuId: 'cost-car-wash',
  //       title: '비용 세차권',
  //       link: '/cost-car-wash',
  //     },
  //   ],
  // },
  {
    menuId: 'app',
    title: '게시판',
    defaultIcon: '/assets/img/icon/app_black.png',
    activeIcon: '/assets/img/icon/app_white.png',
    // link: '/notice',
    children: [
      {
        menuId: 'notice-popup',
        title: '공지 팝업',
        link: '/notice-popup',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'notice',
        title: '공지사항',
        link: '/notice',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'faq',
        title: 'FAQ',
        link: '/faq',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'banner-event',
        title: '배너/이벤트',
        link: '/banner-event',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      {
        menuId: 'terms-policy',
        title: '정책 및 약관',
        link: '/terms-policy',
        status: {
          fe: 'complete',
          be: 'complete',
        },
      },
      // {
      //   menuId: 'inquiry',
      //   title: '1:1문의',
      //   link: '/inquiry',
      //   status: {
      //     fe: 'complete',
      //     be: 'complete',
      //   },
      // },
      // {
      //   menuId: 'review',
      //   title: '리뷰',
      //   link: '/review',
      //   status: {
      //     fe: 'complete',
      //     be: 'complete',
      //   },
      // },
    ],
  },
  {
    menuId: 'cs',
    title: 'CS',
    defaultIcon: '/assets/img/icon/CS_back.png',
    activeIcon: '/assets/img/icon/CS_white.png',
    children: [
      {
        menuId: 'csDashboard',
        title: 'CS 대시보드',
        link: '/cs-dashboard',
      },
      {
        title: 'CS',
        menuId: 'csHome',
        link: '/cs-home',
      },
      {
        menuId: 'template',
        title: '템플릿 관리',
        link: '/template',
      },
      {
        menuId: 'statistics',
        title: '통계',
        link: '/statistics',
      },
    ],
  },
  {
    menuId: 'chargingLogs',
    title: '로그',
    defaultIcon: '/assets/img/icon/log_black.png',
    activeIcon: '/assets/img/icon/log_white.png',
    children: [
      {
        menuId: 'log',
        title: '유저 데이터 로그',
        link: '/log',
        status: {
          fe: 'doing',
          be: 'doing',
        },
      },
      // {
      //   title: '유저 데이터 로그',
      //   menuId: 'logHistory',
      //   link: '/log-history',
      //   status: {
      //     fe: 'doing',
      //     be: 'doing',
      //   },
      // },
      {
        menuId: 'messageLog',
        title: '알림톡 내역관리',
        link: '/message-log',
        status: {
          fe: 'doing',
          be: 'doing',
        },
      },
      {
        menuId: 'charging-log',
        title: '충전로그',
        link: '/charging-log',
      },
      // {
      //   menuId: 'charger-status-history',
      //   title: '충전기 상태 내역',
      //   link: '/charger-status-history',
      // },
      // {
      //   menuId: 'charger-error-history',
      //   title: '충전기 오류 로그',
      //   link: '/charger-error-history',
      // },
      // {
      //   menuId: 'charger-diagnostic',
      //   title: '충전기 진단정보',
      //   link: '/charger-diagnostic',
      // },
      {
        menuId: 'batch-log',
        title: '배치 로그',
        link: '/batch-log',
      },
      {
        menuId: 'payment-log',
        title: '결제로그',
        link: '/payment-log',
      },
      // {
      //   menuId: 'configLog',
      //   title: '콘솔로그',
      //   link: '/config-log',
      // },
    ],
  },
];
