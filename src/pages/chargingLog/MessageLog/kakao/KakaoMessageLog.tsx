import React, { useEffect, useState, type ChangeEvent } from 'react';
import MessageLogGrid from '../MessageLogGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';

import { Input } from 'components/common/Input/Input';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import { MessageLogEdit } from '../MessageLogEdit';
import { KaokaoMessageLogGridHeader } from './KaokaoMessageLogGridHeader';

interface Props {
  search?: boolean;
}
export const KakaoMessageLog = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [MessageLogId, setMessageLogId] = useState<number | ''>('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    startDate: '',
    endDate: '',
    searchKey: '',
    searchVal: '',
    startDateCreate: '',
    endDateCreate: '',
    returnType: '',
    division: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    dataAll,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url:
      `/v1/messageLogs?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}` +
      `&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&endDateCreate=${queryState.endDateCreate}&startDateCreate=${queryState.startDateCreate}&returnType=${queryState.returnType}&messageType=TALK&division=${queryState.division}`,
  });
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
      page: 0,
      odby: 'DESC',
      startDate: '',
      endDate: '',
      searchKey: '',
      searchVal: '',
      startDateCreate: '',
      endDateCreate: '',
      returnType: '',
      division: '',
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
  const validateFromEndDateCreate = (type: string) => {
    const from = new Date(queryState?.startDateCreate);
    const end = new Date(queryState?.endDateCreate);
    // console.log(now);
    // console.log(from);
    // console.log(end);
    // Compare the two dates
    if (
      queryState?.startDateCreate !== '' &&
      queryState?.endDateCreate !== ''
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
            startDateCreate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            endDateCreate: '',
          });
        }
      }
    }
    // Compare the selected date with today
    if (queryState?.startDateCreate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startDateCreate: today,
      });
    }
    if (queryState?.endDateCreate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endDateCreate: today,
      });
    }
  };

  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState?.endDate]);
  useEffect(() => {
    validateFromEndDateCreate('start');
  }, [queryState.startDateCreate]);
  useEffect(() => {
    validateFromEndDateCreate('end');
  }, [queryState?.endDateCreate]);
  return (
    <>
      <DefaultDiv>
        <KaokaoMessageLogGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={search}
          setCheckRowId={setCheckRowId}
          reload={reload}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <MessageLogGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
            setIsEditOpen={setIsEditOpen}
            setMessageLogId={setMessageLogId}
            messageType={'TALK'}
            dataAll={dataAll}
          />
          <MessageLogEdit
            state={state}
            setState={setState}
            isEditOpen={isEditOpen}
            setIsEditOpen={setIsEditOpen}
            setMessageLogId={setMessageLogId}
            MessageLogId={MessageLogId}
            messageType={'TALK'}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
