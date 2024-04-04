import { useEffect, useState } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';

import ChargerModelGridHeader from './ChargerModelGridHeader';
import ChargerModelGridTable from './ChargerModelGridTable';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
const ChargerModelGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
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
  interface ChargerModelInterface {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: string;
    searchVal: string;
    startDate: string;
    endDate: string;
    contype: string;
    speedtype: string;
  }
  const [queryState, setQueryState] = useState<ChargerModelInterface>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
    startDate: '',
    endDate: '',
    contype: '',
    speedtype: '',
  });

  const { loading, error, data, refetch, totalCount }: UseGetListResponse<any> =
    useGetListWt({
      url: `/charger-model?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&contype=${queryState.contype}&speedtype=${queryState.speedtype}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
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
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
      startDate: '',
      endDate: '',
      contype: '',
      speedtype: '',
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
      refetch();
      setCheckRowId([]);
      setState({
        ...state,
        isSuccess: false,
      });
    }
    // 수정 에러
    if (state?.error) {
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
      <ChargerModelGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
      />
      <ChargerModelGridTable
        reload={reload}
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        queryState={queryState}
        setQueryState={setQueryState}
        totalCount={totalCount}
        setCheckRowId={setCheckRowId}
        checkRowId={checkRowId}
      />
    </DefaultDiv>
  );
};

export default ChargerModelGrid;
