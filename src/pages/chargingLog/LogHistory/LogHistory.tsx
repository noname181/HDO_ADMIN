import React, { useEffect, useState, type ChangeEvent } from 'react';
import LogHistoryGrid from './LogHistoryGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';

import { Input } from 'components/common/Input/Input';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import LogHistoryGridHeader from './LogHistoryGridHeader';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

interface Props {
  search?: boolean;
}
export const LogHistory = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: 'all',
    searchVal: '',
    startDate: '',
    endDate: '',
    division: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/v1/web/userslog-list?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&devision=${queryState.division}&type=all`,
  });
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    setCheckRowId([]);
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
      setCheckRowId([]);

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
      searchKey: 'all',
      searchVal: '',
      startDate: '',
      endDate: '',
      division: '',
    });
    setCheckRowId([]);
    refetch();
  };
  return (
    <>
      <DefaultDiv>
        <LogHistoryGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={search}
          setCheckRowId={setCheckRowId}
          reload={reload}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <LogHistoryGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
