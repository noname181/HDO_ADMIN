// Please update this when create new pages. This use for set first page go to after logged in
export const handleSetMainPage = (item: string) => {
  switch (item) {
    case '대시보드':
      return '/';
    case '공통코드 관리':
      return '/codelookup';
    case 'Parameter 관리':
      return '/parameter';
    case 'Errorcode 조회':
      return '/error-code';
    case '충전기 모델 관리':
      return '/charger-model';
    case '충전기 전송파일 관리':
      return '/update-file';
    case '사업장 관리':
      return '/station';
    case '협력사 관리':
      return '/contractor';
    case '고객사 관리':
      return '/client';
    case '모바일 회원':
      return '/mobile-user';
    case 'HDO 관리자':
      return '/admin';
    case '외부 관리자':
      return '/external-admin';
    case '권한관리':
      return '/permission-admin';
    case '충전소':
      return '/charging-station';
    case '충전기 관리':
      return '/charger';
    case '단가테이블':
      return '/charging-unit-price';
    case '충전기 업데이트':
      return '/charger-update';
    case '고장 신고 관리':
      return '/trouble-report';
    case '충전내역':
      return '/charger-history';
    case '충전 결제 내역':
      return '/payment-history';
    case '결제내역':
      return '/payment-details';
    case '미결제 내역':
      return '/outstanding-payment';
    case '멤버쉽':
      return '/bonus-card';
    case '포인트':
      return '/point';
    case '세차권':
      return '/car-wash';
    case '쿠폰':
      return '/coupon';
    case '일매출관리':
      return '/settlement';
    case '일수금관리':
      return '/daily-payment';
    case '월정산관리':
      return '/monthly-settlement';
    case '공지사항':
      return '/notice';
    case 'FAQ':
      return '/faq';
    case '배너/이벤트':
      return '/banner-event';
    case '정책 및 약관':
      return '/terms-policy';
    case '1:1문의':
      return '/inquiry';
    case '리뷰':
      return '/review';
    case 'CS':
    case 'Consultation':
      return '/cs-home';
    case '유저 데이터 로그':
      return '/log';
    case '알림톡 내역관리':
      return '/message-log';
    case '템플릿 관리':
      return '/template';
    case 'CS 대시보드':
      return '/cs-dashboard';
    case '통계':
      return '/statistics';
    case '충전기 상태 내역':
      return '/charger-status-history';
    case '충전기 오류 로그':
      return '/charger-error-history';
    case '충전기 진단정보':
      return '/charger-diagnostic';
    case '배치 로그':
      return '/batch-log';
    case '공지 팝업':
      return '/notice-popup';
    case '콘솔로그':
      return '/config-log';
    case '충전로그':
      return '/charging-log';
    case '결제로그':
      return '/payment-log';
    default:
      break;
  }
};
