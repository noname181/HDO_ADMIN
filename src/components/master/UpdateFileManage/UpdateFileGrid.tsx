import { useEffect, useState } from 'react';

import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv, GridRefetch } from 'styles/style';

import UpdateFileGridHeader from './UpdateFileGridHeader';
import UpdateFileGridTable from './UpdateFileGridTable';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const UpdateFileGrid = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [checkRowId, setCheckRowId] = useState<
    Array<{ id: number; newestVersion: boolean }>
  >([]);
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    division: '',
    startDate: '',
    endDate: '',
  });

  const { loading, error, data, refetch } = useGetListWt({
    url: `/file-to-update?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
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
      division: '',
      startDate: '',
      endDate: '',
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
  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState.endDate]);
  // console.log(data);
  return (
    <DefaultDiv>
      <UpdateFileGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
      />
      <UpdateFileGridTable
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        setCheckRowId={setCheckRowId}
        checkRowId={checkRowId}
      />
    </DefaultDiv>
  );
};

export default UpdateFileGrid;
