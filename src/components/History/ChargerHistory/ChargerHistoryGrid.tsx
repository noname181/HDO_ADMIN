import { useState, useEffect } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import ChargerHistoryGridHeader from './ChargerHistoryGridHeader';
import ChargerHistoryGridTable from './ChargerHistoryGridTable';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const ChargerHistoryGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayYear = String(yesterdayDate.getFullYear());
  const yesterdayMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yesterdayNumber = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayNumber}`;
  interface PaymentHistoryInterface {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    division: '' | 'STT_DIR' | 'STT_FRN' | 'EV_DIV';
    isCredit: '' | 'Y' | 'N';
    payCompletedYN: '' | 'Y' | 'N';
    searchKey: string;
    searchVal: string;
    startDate: string;
    endDate: string;
    startPaymentDate: string;
    endPaymentDate: string;
  }
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    division: '',
    isCredit: '',
    payCompletedYN: '',
    searchKey: '',
    searchVal: '',
    startDate: yesterday,
    endDate: today,
    startPaymentDate: '',
    endPaymentDate: '',
    area: '',
    branch: '',
    region: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    totalClCharge,
    totalClChargeHDO,
  }: UseGetListResponse<PaymentHistoryInterface> = useGetListWt({
    url: `/v1/payment/charger-history?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&org=${queryState.division}&isCredit=${queryState.isCredit}&payCompletedYN=${queryState.payCompletedYN}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&startPaymentDate=${queryState.startPaymentDate}&endPaymentDate=${queryState.endPaymentDate}&area=${queryState.area}&branch=${queryState.branch}&region=${queryState.region}`,
  });

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      division: '',
      isCredit: '',
      payCompletedYN: '',
      searchKey: '',
      searchVal: '',
      startDate: yesterday,
      endDate: today,
      startPaymentDate: '',
      endPaymentDate: '',
      area: '',
      branch: '',
      region: '',
    });
    refetch();
  };
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    refetch();
  };
  const validateFromEndDate = (type: string) => {
    const from = new Date(queryState?.startDate);
    const end = new Date(queryState?.endDate);
    // console.log(now);
    // console.log(from);
    // console.log(end);
    // Compare the two dates
    if (queryState?.startDate !== '' && queryState?.endDate !== '') {
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });
        if (type === 'start') {
          setQueryState({
            ...queryState,
            startDate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            endDate: '',
          });
        }
      }
    }
    // Compare the selected date with today
    if (queryState?.startDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startDate: today,
      });
    }
    if (queryState?.endDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endDate: today,
      });
    }
  };
  const validateFromEndPaymentDate = (type: string) => {
    const from = new Date(queryState?.startDate);
    const end = new Date(queryState?.endDate);
    // console.log(now);
    // console.log(from);
    // console.log(end);
    // Compare the two dates
    if (
      queryState?.startPaymentDate !== '' &&
      queryState?.endPaymentDate !== ''
    ) {
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });
        if (type === 'start') {
          setQueryState({
            ...queryState,
            startPaymentDate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            endPaymentDate: '',
          });
        }
      }
    }
    // Compare the selected PaymentDate with today
    if (queryState?.startPaymentDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startPaymentDate: today,
      });
    }
    if (queryState?.endPaymentDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endPaymentDate: today,
      });
    }
  };
  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState.endDate]);
  useEffect(() => {
    validateFromEndPaymentDate('start');
  }, [queryState.startPaymentDate]);
  useEffect(() => {
    validateFromEndPaymentDate('end');
  }, [queryState.endPaymentDate]);
  return (
    <DefaultDiv>
      <ChargerHistoryGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <ChargerHistoryGridTable
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        totalCount={totalCount}
        setQueryState={setQueryState}
        queryState={queryState}
        totalClCharge={totalClCharge}
        totalClChargeHDO={totalClChargeHDO}
      />
    </DefaultDiv>
  );
};
export default ChargerHistoryGrid;
