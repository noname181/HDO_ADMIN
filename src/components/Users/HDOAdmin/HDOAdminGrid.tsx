import { useState, useEffect } from 'react';

import { useGetListWt } from 'hooks/useGetListWt';

import HDOAdminGridHeader from './HDOAdminGridHeader';
import HDOAdminGridTable from './HDOAdminGridTable';
import { DefaultDiv } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const HDOAdminGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState({
    rpp: 50, // 1page data 조회 갯수
    page: 1, // rpp에 따른 조회 페이지 번호
    odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: 'ALL',
    searchVal: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  const { loading, totalCount, data, refetch } = useGetListWt({
    url: `/v1/web/users?userType=hdo&org=hdo&rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&status=${queryState.status}`,
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
  }, [state]);

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50, // 1page data 조회 갯수
      page: 1, // rpp에 따른 조회 페이지 번호
      odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    });
    setCheckRowId([]);

    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50, // 1page data 조회 갯수
      page: 1, // rpp에 따른 조회 페이지 번호
      odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
      searchKey: 'ALL',
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
    <DefaultDiv>
      <HDOAdminGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
      />
      <HDOAdminGridTable
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

export default HDOAdminGrid;
