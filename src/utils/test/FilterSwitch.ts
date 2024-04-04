export function category(item: string) {
  switch (item) {
    case 'DEF':
      return '일반이용자';
    case 'HDO':
      return '현대오일뱅크';
    case 'STT_DIR':
      return '직영주유소';
    case 'STT_FRN':
      return '자영/가맹주유소';
    case 'CS':
      return 'CS';
    case 'AS':
      return 'AS';
    case 'BIZ':
      return '법인';
    case 'ALLNC':
      return '제휴';
    case 'GRP':
      return '그룹';
    case 'RF_CARD':
      return '파킹스루';
    case 'ETC':
      return '기타';
    default:
      return '없음';
  }
}

export function retired(item: boolean) {
  switch (item) {
    case false:
      return '재직';
    case true:
      return '퇴사';
    default:
      return '-';
  }
}
export function status(item: string) {
  switch (item) {
    case 'ACTIVE':
      return '재직';
    case 'BLOCK':
      return '퇴사';
    default:
      return '-';
  }
}

export function closed(item: boolean) {
  const value = item.toString();
  switch (value) {
    case 'false':
      return '운영';
    case 'true':
      return '정지';
    default:
      return '데이터가 비어있습니다';
  }
}

export function CarWash(item: boolean) {
  const value = item.toString();
  switch (value) {
    case 'false':
      return 'X';
    case 'true':
      return 'O';
    default:
      return '-';
  }
}

export const boolean = (item: boolean) => {
  switch (item) {
    case false:
      return 'N';
    case true:
      return 'Y';
    default:
      return '-';
  }
};

export const chargingSpeed = (item: string) => {
  switch (item) {
    case '1':
      return '100kwh';
    case '2':
      return '150kwh';
    case '3':
      return '200kwh';
    default:
      return '-';
  }
};

export const speedType = (item: string) => {
  switch (item) {
    case '1':
      return '초고속';
    case '2':
      return '급속';
    case '3':
      return '중속';
    case '4':
      return '완속';
    default:
      return '-';
  }
};

export const lastFirmwareVer = (item: string) => {
  switch (item) {
    case '클릭해서 FW를 등록해주세요':
      return '-';
    case 'FW 등록이 필요합니다':
      return '-';
    case null:
      return '-';
    default:
      return item;
  }
};

export const chargerState = (item: string) => {
  switch (item) {
    case '0':
      return '알수없음';
    case '1':
      return '통신이상';
    case '2':
      return '충전대기';
    case '3':
      return '충전중';
    case '4':
      return '운영중지';
    case '5':
      return '점검중';
    case '6':
      return '예약중';
    case '9':
      return '상태미확인';
    default:
      return '-';
  }
};
