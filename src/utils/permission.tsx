// Please update this when create new pages. This use for permission
// check permission have rule or not
export const handleCheckAllRules = (rules: any) => {
  return rules?.read || rules?.write || rules?.delete;
};

// set form item data and reset mainMenu data if uncheck item
export const handleSetChecked = (item: any, form: any) => {
  const mainMenu = form.getFieldValue('mainMenu');
  switch (item?.name) {
    case '대시보드':
      form.setFieldsValue({
        대시보드: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '대시보드' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '공통코드 관리':
      form.setFieldsValue({
        '공통코드 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '공통코드 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'Parameter 관리':
      form.setFieldsValue({
        'Parameter 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'Parameter 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'Errorcode 조회':
      form.setFieldsValue({
        'Errorcode 조회': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'Errorcode 조회' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 모델 관리':
      form.setFieldsValue({
        '충전기 모델 관리': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '충전기 모델 관리' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 전송파일 관리':
      form.setFieldsValue({
        '충전기 전송파일 관리': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '충전기 전송파일 관리' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '사업장 관리':
      form.setFieldsValue({
        '사업장 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '사업장 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '협력사 관리':
      form.setFieldsValue({
        '협력사 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '협력사 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '고객사 관리':
      form.setFieldsValue({
        '고객사 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '고객사 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '모바일 회원':
      form.setFieldsValue({
        '모바일 회원': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '모바일 회원' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'HDO 관리자':
      form.setFieldsValue({
        'HDO 관리자': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'HDO 관리자' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '외부 관리자':
      form.setFieldsValue({
        '외부 관리자': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '외부 관리자' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '권한관리':
      form.setFieldsValue({
        권한관리: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '권한관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전소':
      form.setFieldsValue({
        충전소: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전소' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 관리':
      form.setFieldsValue({
        '충전기 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전기 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '단가테이블':
      form.setFieldsValue({
        단가테이블: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '단가테이블' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 업데이트':
      form.setFieldsValue({
        '충전기 업데이트': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전기 업데이트' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '고장 신고 관리':
      form.setFieldsValue({
        '고장 신고 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '고장 신고 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전내역':
      form.setFieldsValue({
        충전내역: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전내역' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '예약내역':
      form.setFieldsValue({
        예약내역: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '예약내역' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전 결제 내역':
      form.setFieldsValue({
        '충전 결제 내역': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전 결제 내역' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '결제내역':
      form.setFieldsValue({
        결제내역: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '결제내역' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '미결제 내역':
      form.setFieldsValue({
        '미결제 내역': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '미결제 내역' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '미출차 결제 내역':
      form.setFieldsValue({
        '미출차 결제 내역': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '미출차 결제 내역' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '멤버쉽':
      form.setFieldsValue({
        멤버쉽: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '멤버쉽' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '포인트':
      form.setFieldsValue({
        포인트: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '포인트' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '세차권':
      form.setFieldsValue({
        세차권: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '세차권' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '쿠폰':
      form.setFieldsValue({
        쿠폰: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '쿠폰' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '통계':
      form.setFieldsValue({
        통계: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '통계' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '일매출관리':
      form.setFieldsValue({
        일매출관리: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '일매출관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '일수금관리':
      form.setFieldsValue({
        일수금관리: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '일수금관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '월정산관리':
      form.setFieldsValue({
        월정산관리: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '월정산관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '공지 팝업':
      form.setFieldsValue({
        '공지 팝업': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '공지 팝업' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '공지사항':
      form.setFieldsValue({
        공지사항: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '공지사항' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'FAQ':
      form.setFieldsValue({
        FAQ: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'FAQ' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '배너/이벤트':
      form.setFieldsValue({
        '배너/이벤트': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '배너/이벤트' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '정책 및 약관':
      form.setFieldsValue({
        '정책 및 약관': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '정책 및 약관' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '1:1문의':
      form.setFieldsValue({
        '1:1문의': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '1:1문의' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '리뷰':
      form.setFieldsValue({
        리뷰: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '리뷰' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'CS':
      form.setFieldsValue({
        CS: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'CS' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'Consultation':
      form.setFieldsValue({
        Consultation: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'Consultation' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '유저 데이터 로그':
      form.setFieldsValue({
        '유저 데이터 로그': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '유저 데이터 로그' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '알림톡 내역관리':
      form.setFieldsValue({
        '알림톡 내역관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '알림톡 내역관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '로그':
      form.setFieldsValue({
        로그: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '로그' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '템플릿 관리':
      form.setFieldsValue({
        '템플릿 관리': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '템플릿 관리' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 상태 내역':
      form.setFieldsValue({
        '충전기 상태 내역': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '충전기 상태 내역' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 오류 로그':
      form.setFieldsValue({
        '충전기 오류 로그': handleCheckAllRules(item?.rules),
      });
      if (
        mainMenu === '충전기 오류 로그' &&
        !handleCheckAllRules(item?.rules)
      ) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '배치 로그':
      form.setFieldsValue({
        '배치 로그': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '배치 로그' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전기 진단정보':
      form.setFieldsValue({
        '충전기 진단정보': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전기 진단정보' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '콘솔로그':
      form.setFieldsValue({
        콘솔로그: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '콘솔로그' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case 'CS 대시보드':
      form.setFieldsValue({
        'CS 대시보드': handleCheckAllRules(item?.rules),
      });
      if (mainMenu === 'CS 대시보드' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '충전로그':
      form.setFieldsValue({
        충전로그: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '충전로그' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    case '결제로그':
      form.setFieldsValue({
        결제로그: handleCheckAllRules(item?.rules),
      });
      if (mainMenu === '결제로그' && !handleCheckAllRules(item?.rules)) {
        form.setFieldsValue({ mainMenu: null });
      }
      break;
    default:
      break;
  }
};
// convert permission data to array
export const addListPermission = (data: any) => {
  const tempArr: any[] = [];
  tempArr.push(
    data?.dashBoard,
    data?.systemSetting,
    data?.belong,
    data?.userManagement,
    data?.charger,
    data?.history,
    // data?.gift,
    data?.settlement,
    data?.notice,
    data?.cs,
    // data?.consultation,
    data?.chargingLogs,
  );

  return tempArr;
};
const handelLogoutPermission = (data: any, menuName: string) => {
  // eslint-disable-next-line no-case-declarations
  const codelookup = data?.filter((pers: any) => pers?.name === menuName);
  if (!handleCheckAllRules(codelookup[0]?.rules)) return true;
};
// check permission of account logged in
export const handleCheckPermisstion = (urlPath: any, user: any) => {
  switch (urlPath) {
    case '/':
      return handelLogoutPermission(
        user?.role?.dashBoard?.permissions,
        '대시보드',
      );

    case '/codelookup':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        '공통코드 관리',
      );

    case '/parameter':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        'Parameter 관리',
      );

    case '/error-code':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        'Errorcode 조회',
      );

    case '/charger-model':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        '충전기 모델 관리',
      );

    case '/update-file':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        '충전기 전송파일 관리',
      );

    case '/permission-admin':
      return handelLogoutPermission(
        user?.role?.systemSetting?.permissions,
        '권한관리',
      );

    case '/station':
      return handelLogoutPermission(
        user?.role?.belong?.permissions,
        '사업장 관리',
      );

    case '/contractor':
      return handelLogoutPermission(
        user?.role?.belong?.permissions,
        '협력사 관리',
      );

    case '/client':
      return handelLogoutPermission(
        user?.role?.belong?.permissions,
        '고객사 관리',
      );

    case '/mobile-user':
      return handelLogoutPermission(
        user?.role?.userManagement?.permissions,
        '모바일 회원',
      );

    case '/admin':
      return handelLogoutPermission(
        user?.role?.userManagement?.permissions,
        'HDO 관리자',
      );

    case '/external-admin':
      return handelLogoutPermission(
        user?.role?.userManagement?.permissions,
        '외부 관리자',
      );

    case '/charging-station':
      return handelLogoutPermission(user?.role?.charger?.permissions, '충전소');

    case '/charger':
      return handelLogoutPermission(
        user?.role?.charger?.permissions,
        '충전기 관리',
      );

    case '/charging-unit-price':
      return handelLogoutPermission(
        user?.role?.charger?.permissions,
        '단가테이블',
      );

    case '/charger-update':
      return handelLogoutPermission(
        user?.role?.charger?.permissions,
        '충전기 업데이트',
      );

    case '/trouble-report':
      return handelLogoutPermission(
        user?.role?.charger?.permissions,
        '고장 신고 관리',
      );

    case '/payment-history':
      return handelLogoutPermission(
        user?.role?.history?.permissions,
        '예약내역',
      );

    case '/payment-details':
      return handelLogoutPermission(
        user?.role?.history?.permissions,
        '결제내역',
      );

    case '/outstanding-payment':
      return handelLogoutPermission(
        user?.role?.history?.permissions,
        '미결제 내역',
      );

    case '/reservation':
      return handelLogoutPermission(
        user?.role?.history?.permissions,
        '충전 결제 내역',
      );

    case '/unexported-payment':
      return handelLogoutPermission(
        user?.role?.history?.permissions,
        '미출차 결제 내역',
      );

    case '/bonus-card':
      return handelLogoutPermission(user?.role?.gift?.permissions, '멤버쉽');

    case '/point':
      return handelLogoutPermission(user?.role?.gift?.permissions, '포인트');

    case '/car-wash':
      return handelLogoutPermission(user?.role?.gift?.permissions, '세차권');

    case '/coupon':
      return handelLogoutPermission(user?.role?.gift?.permissions, '쿠폰');

    case '/added-service-stats':
      return handelLogoutPermission(user?.role?.gift?.permissions, '통계');

    case '/settlement':
      return handelLogoutPermission(
        user?.role?.settlement?.permissions,
        '일매출관리',
      );

    case '/daily-payment':
      return handelLogoutPermission(
        user?.role?.settlement?.permissions,
        '일수금관리',
      );

    case '/monthly-settlement':
      return handelLogoutPermission(
        user?.role?.settlement?.permissions,
        '월정산관리',
      );
    case '/notice-popup':
      return handelLogoutPermission(
        user?.role?.notice?.permissions,
        '공지 팝업',
      );
    case '/notice':
      return handelLogoutPermission(
        user?.role?.notice?.permissions,
        '공지사항',
      );

    case '/faq':
      return handelLogoutPermission(user?.role?.notice?.permissions, 'FAQ');

    case '/banner-event':
      return handelLogoutPermission(
        user?.role?.notice?.permissions,
        '배너/이벤트',
      );

    case '/terms-policy':
      return handelLogoutPermission(
        user?.role?.notice?.permissions,
        '정책 및 약관',
      );

    case '/inquiry':
      return handelLogoutPermission(user?.role?.notice?.permissions, '1:1문의');

    case '/review':
      return handelLogoutPermission(user?.role?.notice?.permissions, '리뷰');

    case '/cs-main':
      return handelLogoutPermission(user?.role?.cs?.permissions, 'CS');

    case '/consultation':
      return handelLogoutPermission(
        user?.role?.consultation?.permissions,
        'Consultation',
      );

    case '/as-consultation':
      return handelLogoutPermission(user?.role?.cs?.permissions, 'CS');

    case '/template':
      return handelLogoutPermission(user?.role?.cs?.permissions, '템플릿 관리');
    case '/cs-dashboard':
      return handelLogoutPermission(user?.role?.cs?.permissions, 'CS 대시보드');
    case '/statistics':
      return handelLogoutPermission(user?.role?.cs?.permissions, '통계');
    case '/charger-status-history':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '충전기 상태 내역',
      );

    case '/charger-error-history':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '충전기 오류 로그',
      );

    case '/log-history':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '유저 데이터 로그',
      );

    case '/message-log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '알림톡 내역관리',
      );

    case '/log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '로그',
      );

    case '/batch-log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '배치 로그',
      );

    case '/charger-diagnostic':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '충전기 진단정보',
      );
    case '/config-log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '콘솔로그',
      );
    case '/charging-log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '충전로그',
      );
    case '/payment-log':
      return handelLogoutPermission(
        user?.role?.chargingLogs?.permissions,
        '결제로그',
      );
    default:
      return false;
  }
};

export const isActualServer = () => {
  const disableDomain = 'https://evnu.oilbank.co.kr';
  // Get the current domain
  const currentDomain = window.location.origin;
  if (currentDomain !== disableDomain) {
    return false;
  } else {
    return true;
  }
};
export const isHidePageOnActualServer = (pagaName: string) => {
  // hide trouble-report and review permission
  // return pagaName === '고장 신고 관리' || pagaName === '리뷰';
  // hide review permission
  const listPage = [
    'Errorcode 조회',
    '리뷰',
    '고객사 관리',
    '단가테이블',
    '예약내역',
    '충전 결제 내역',
    '미출차 결제 내역',
    '1:1문의',
    'CS 대시보드',
    '통계',
    '로그',
  ];
  return listPage.includes(pagaName);
};
