import { useState, useEffect, useRef } from 'react';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import { type StateInterface, type ITroubleReport } from 'interfaces/ICommon';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import TroubleReportGridTable from './TroubleReportGridTable';
import { TroubleReportGridHeader } from './TroubleReportGridHeader';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const TroubleReportGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<ITroubleReport> = useGetListWt({
    url: `/trouble?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&status=${queryState.status}`,
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
      setCheckRowId([]);

      reload();
      setState({
        ...state,
        isSuccess: false,
      });
    }
    if (error) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });
    setCheckRowId([]);

    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      startDate: '',
      endDate: '',
      status: '',
    });
    setCheckRowId([]);

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
    <>
      <DefaultDiv>
        <TroubleReportGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={search}
          reload={reload}
        />
        <TroubleReportGridTable
          state={state}
          setState={setState}
          loading={loading}
          data={data}
          totalCount={totalCount}
          queryState={queryState}
          setQueryState={setQueryState}
          setCheckRowId={setCheckRowId}
          checkRowId={checkRowId}
        />
      </DefaultDiv>
    </>
  );
};
