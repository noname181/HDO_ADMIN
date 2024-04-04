import React, { useEffect, useState, type ChangeEvent } from 'react';
import NoticePopUpGrid from './NoticePopUpGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';

import { Input } from 'components/common/Input/Input';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import { NoticePopUpEdit } from './NoticePopUpEdit';
import NoticePopUpGridHeader from './NoticePopUpGridHeader';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

interface Props {
  search?: boolean;
}
export const NoticePopUp = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
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
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    title: '',
    exposure: '',
    startDate: '',
    endDate: '',
    type: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/v1/web/notice?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&title=${queryState.title}&active=${queryState.exposure}&firstDate=${queryState.startDate}&lastDate=${queryState.endDate}&type=${queryState.type}`,
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
      setState({
        ...state,
        isSuccess: false,
      });
      setCheckRowId([]);

      refetch();
    }
  }, [state]);
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
  // useEffect(() => {
  //   validateFromEndDate('start');
  // }, [queryState.startDate]);
  // useEffect(() => {
  //   validateFromEndDate('end');
  // }, [queryState.endDate]);
  return (
    <>
      <DefaultDiv>
        <NoticePopUpGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          setCheckRowId={setCheckRowId}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <NoticePopUpGrid
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
