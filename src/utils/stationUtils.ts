import { Select } from 'antd';
import {
  StyledFormItem,
  StyledSelect,
  StyledSelectDB,
  StyledFormItemDB,
} from 'components/common/test/Styled.ant';
import { useGetListWt } from 'hooks/useGetListWt';
import { type ChargerModelInterface } from 'interfaces/ICharger';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export function category(item: string) {
  // switch (item) {
  //   case 'DEF':
  //     return '일반';
  //   case 'HDO':
  //     return '현대오일뱅크';
  //   case 'STT_DIR':
  //     return '직영 주유소';
  //   case 'STT_FRN':
  //     return '자영 주유소';
  //   case 'CS':
  //     return 'CS';
  //   case 'AS':
  //     return 'AS';
  //   case 'BIZ':
  //     return '법인';
  //   case 'ALLNC':
  //     return '제휴';
  //   case 'GRP':
  //     return '그룹';
  //   case 'RF_CARD':
  //     return '파킹스루';
  //   default:
  //     return '데이터 에러';
  // }
  if (item === 'DEF') {
    return '일반';
  } else if (item === 'HDO') {
    return '현대오일뱅크';
  } else if (item === 'STT_DIR' || item === 'X1') {
    return '직영 주유소';
  } else if (item === 'STT_FRN' || item === 'A1') {
    return '자영 주유소';
  } else if (item === 'CS') {
    return 'CS';
  } else if (item === 'AS') {
    return 'AS';
  } else if (item === 'BIZ') {
    return '법인';
  } else if (item === 'ALLNC') {
    return '제휴';
  } else if (item === 'GRP') {
    return '그룹';
  } else if (item === 'RF_CARD') {
    return '파킹스루';
  } else if (item === 'EV_DIV') {
    return 'EV사업팀';
  } else if (item === 'ETC') {
    return '기타';
  } else {
    return item;
  }
}

export function chargerState(item: string) {
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
      return '데이터에러';
  }
}

export function chargeSpeed(item: string) {
  switch (item) {
    case '1':
      return '100kwh';
    case '2':
      return '150kwh';
    case '3':
      return '200kwh';
    default:
      return '데이터에러';
  }
}

export function handCarWash(item: boolean) {
  const value = item.toString();
  switch (value) {
    case 'N':
      return '-';
    case 'Y':
      return 'O';
    default:
      return '데이터가 비어있습니다';
  }
}

export const Station = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<OrganizationInterface>({
    url: `/orgs?cate=station`,
  });

  useEffect(() => {
    if (error !== null) {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: 'API 호출 에러',
        content: error?.message || 'API 호출 에러',
      });
    }
  }, [error]);

  return { loadingStationList: loading, stationList: data };
};
export const UnregisterStation = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<OrganizationInterface>({
    url: '/orgs/unregister/charging-station',
  });

  useEffect(() => {
    if (error !== null) {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: 'API 호출 에러',
        content: error?.message || 'API 호출 에러',
      });
    }
  }, [error]);

  return { loadingStationList: loading, stationList: data };
};

export const AreaBranch = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState<number | ''>('');
  const { loading, error, data } = useGetListWt<any>({
    url: '/area-branches',
  });

  useEffect(() => {
    if (error !== null) {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: 'API 호출 에러',
        content: error?.message || 'API 호출 에러',
      });
    }
  }, [error]);

  const handleAreaChange = (selectedAreaNo: number | '') => {
    setAreaNo(selectedAreaNo);
  };

  let branchList;

  if (areaNo) {
    branchList = data?.find((area) => area.areaNo === areaNo)?.branch;
  } else {
    branchList = data?.flatMap((area) => area.branch);
  }

  const areaList = data?.map((area) => ({
    area: area.area,
    areaNo: area.areaNo,
  }));

  return { areaList, branchList, handleAreaChange };
};

export const ChargerModel = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<ChargerModelInterface>({
    url: `/charger-model`,
  });

  useEffect(() => {
    if (error !== null) {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: 'API 호출 에러',
        content: error?.message || 'API 호출 에러',
      });
    }
  }, [error]);

  const ChargerModelList = data?.map((item) => ({
    value: item.id,
    label: item.modelName,
    ...item,
  }));

  const ChargerModelInfo = (value: number | string) => {
    let info = '등록되지 않은 충전기 모델';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.id) {
          info = item.modelName;
        }
      }
      if (value === item.id) {
        info = item.modelName;
      }
    });
    return info;
  };

  return {
    loadingChargerModelList: loading,
    ChargerModelList,
    ChargerModelInfo,
  };
};
export const TermsModel = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<any>({
    url: `/terms?rpp=10000000000&page=0&odby=DESC&select=ALL&search=`,
  });

  useEffect(() => {
    if (error !== null) {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: 'API 호출 에러',
        content: error?.message || 'API 호출 에러',
      });
    }
  }, [error]);

  const TermsModelList = data?.map((item) => ({
    value: item.id,
    title: item.title,
    ...item,
  }));

  return {
    loadingTermsList: loading,
    TermsModelList,
  };
};
