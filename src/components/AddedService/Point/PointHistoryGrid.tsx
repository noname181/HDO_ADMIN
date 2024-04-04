import { useState, useEffect } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import PointHistoryGridHeader from './PointHistoryGridHeader';
import PointHistoryGridTable from './PointHistoryGridTable';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const PointHistoryGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  interface PointHistory {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    pType: '' | 'use' | 'earn';
    startDate: string;
    endDate: string;
  }
  const [queryState, setQueryState] = useState<PointHistory>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    pType: '',
    startDate: '',
    endDate: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<PointHistory> = useGetListWt({
    url: `/v1/point?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&pType=${queryState.pType}`,
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
    // console.log(data);
  }, [state]);
  return (
    <DefaultDiv>
      <PointHistoryGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={refetch}
      />
      <PointHistoryGridTable
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
      />
    </DefaultDiv>
  );
};
export default PointHistoryGrid;
