export const KoreaNamePage = (value: number | string, status: string) => {
  let urlpage = '';
  if (value === '/users/logs' && status === 'LOGOUT') {
    urlpage = '로그아웃';
  }
  if (value === '/v1/web/auth/external/login' && status === 'SUCCESS') {
    urlpage = '로그인';
  }
  if (value === '/v1/web/auth/hdo/login' && status === 'SUCCESS') {
    urlpage = '로그인';
  }
  switch (value) {
    case '/':
      return '대시보드';
    case '/users/logs':
      return urlpage;
    case '/v1/web/auth/external/login':
      return urlpage;
    case '/v1/web/auth/hdo/login':
      return urlpage;
    case '/codelookup':
      return '공통코드 관리';
    case '/parameter':
      return 'Parameter 관리';

    case '/error-code':
      return 'Errorcode 조회';

    case '/charger-model':
      return '충전기 모델 관리';

    case '/update-file':
      return '충전기 전송파일 관리';

    case '/permission-admin':
      return '권한관리';

    case '/station':
      return '사업장 관리';

    case '/contractor':
      return '협력사 관리';

    case '/client':
      return '고객사 관리';

    case '/mobile-user':
      return '모바일 회원';

    case '/admin':
      return 'HDO 관리자';

    case '/external-admin':
      return '외부 관리자';

    case '/charging-station':
      return '충전소';

    case '/charger':
      return '충전기 관리';

    case '/charging-unit-price':
      return '단가테이블';

    case '/charger-update':
      return '충전기 업데이트';

    case '/trouble-report':
      return '고장 신고 관리';
    case '/charger-history':
      return '충전내역';
    case '/payment-history':
      return '충전 결제 내역';
    case '/payment-details':
      return '결제내역';

    case '/outstanding-payment':
      return '미결제 내역';

    case '/reservation':
      return '충전 결제 내역';

    case '/unexported-payment':
      return '미출차 결제 내역';

    case '/bonus-card':
      return '멤버쉽';

    case '/point':
      return '포인트';

    case '/car-wash':
      return '세차권';

    case '/coupon':
      return '쿠폰';
    case '/added-service-stats':
      return '통계';
    case '/settlement':
      return '일매출관리';

    case '/daily-payment':
      return '일수금관리';

    case '/monthly-settlement':
      return '월정산관리';
    case '/notice-popup':
      return '공지 팝업';
    case '/notice':
      return '공지사항';

    case '/faq':
      return 'FAQ';

    case '/banner-event':
      return '배너/이벤트';

    case '/terms-policy':
      return '정책 및 약관';

    case '/inquiry':
      return '1:1문의';

    case '/review':
      return '리뷰';

    case '/cs-main':
      return 'CS';
    case '/cs-home':
      return 'CS';

    case '/consultation':
      return '상담 내역';

    case '/as-consultation':
      return 'CS';

    case '/template':
      return '템플릿 관리';
    case '/cs-dashboard':
      return 'CS 대시보드';
    case '/statistics':
      return '통계';
    case '/charger-status-history':
      return '충전기 상태 내역';
    case '/charger-error-history':
      return '충전기 오류 로그';

    // case '/log-history':
    //   handelLogoutPermission(
    //     user?.role?.chargingLogs?.permissions,
    //     '유저 데이터 로그',
    //   );
    //
    case '/message-log':
      return '알림톡 내역관리';
    case '/log':
      return '유저 데이터 로그';
    case '/batch-log':
      return '배치 로그';
    case '/charger-diagnostic':
      return '충전기 진단정보 ';
    case '/config-log':
      return '콘솔로그';
    case '/charging-log':
      return '충전로그';
    case '/payment-log':
      return '결제로그';
    default:
      return '';
  }
};
