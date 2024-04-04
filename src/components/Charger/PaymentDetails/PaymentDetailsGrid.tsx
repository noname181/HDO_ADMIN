import { useState, useEffect } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import PaymentDetailsGridHeader from './PaymentDetailsGridHeader';
import PaymentDetailsGridTable from './PaymentDetailsGridTable';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const PaymentDetailsGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  interface PaymentDetailsInterface {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    member: '' | 'Y' | 'N';
    payType: '' | 'pnc' | 'qr' | '회원카드';
    method: string;
    searchKey: string;
    searchVal: string;
    area: string;
    branch: string;
    category: string;
    startDate: string;
    endDate: string;
  }
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
  const [queryState, setQueryState] = useState<PaymentDetailsInterface>({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    member: '',
    searchKey: '',
    searchVal: '',
    payType: '',
    method: '',
    area: '',
    branch: '',
    category: '',
    startDate: yesterday,
    endDate: today,
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    dataAll,
  }: UseGetListResponse<PaymentDetailsInterface> = useGetListWt({
    url:
      `/v1/payment/history/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}&method=${queryState.method}&category=${queryState.category}&member=${queryState.member}&payType=${queryState.payType}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
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
    // console.log('refetch');
    // console.log(queryState.page);
  }, [state, queryState]);

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      member: '',
      searchKey: '',
      searchVal: '',
      payType: '',
      method: '',
      area: '',
      branch: '',
      category: '',
      startDate: yesterday,
      endDate: today,
    });
    setAreaNo('');
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
  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState.endDate]);
  return (
    <DefaultDiv>
      <PaymentDetailsGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <PaymentDetailsGridTable
        queryState={queryState}
        setQueryState={setQueryState}
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        totalCount={totalCount}
        totalAmount={dataAll?.totalAmount}
        totalRefund={dataAll?.totalRefund}
      />
    </DefaultDiv>
  );
};
export default PaymentDetailsGrid;
