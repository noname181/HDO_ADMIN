import React, { useEffect, useState } from 'react';
import ChargerErrorHistoryGrid from './ChargerErrorHistoryGrid';
import { GridContainer, DefaultDiv } from 'styles/style';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import ChargerErrorHistoryGridHeader from './ChargerErrorHistoryGridHeader';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

export const ChargerErrorHistory = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  // const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/charger-error-history?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&reason=${queryState.reason}`,
  });
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    // setCheckRowId([]);
    refetch();
  };
  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setState({
        ...state,
        isSuccess: false,
      });
      // setCheckRowId([]);

      refetch();
    }
    if (state.error) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    // setCheckRowId([]);
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
  }, [queryState?.endDate]);
  return (
    <>
      <DefaultDiv>
        <ChargerErrorHistoryGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={search}
          // setCheckRowId={setCheckRowId}
          reload={reload}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <ChargerErrorHistoryGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            // setCheckRowId={setCheckRowId}
            // checkRowId={checkRowId}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
