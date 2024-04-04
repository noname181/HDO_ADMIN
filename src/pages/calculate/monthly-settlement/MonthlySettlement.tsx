import { useEffect, useState } from 'react';
import MonthlySettlementGrid from './MonthlySettlementGrid';
import { GridContainer, DefaultDiv } from 'styles/style';

import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type IMonthlySettlement,
  type StateInterface,
} from 'interfaces/ICommon';
import MonthlySettlementGridHeader from './MonthlySettlementGridHeader';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
// import MonthlySettlementPopUp from './MonthlySettlementPopUp';

export const MonthlySettlement = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    class: '',
    paymentMethod: '',
    startDate: '',
    month: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<IMonthlySettlement> = useGetListWt({
    url: `/monthly-payment?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&month=${queryState.month}`,
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

      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const monthFormat = `${year}-${month}`;

  const validateFromEndDate = () => {
    // const from = new Date(queryState?.startDate);
    // const end = new Date(queryState?.endDate);
    // console.log(now);
    // console.log(from);
    // console.log(end);
    // Compare the two dates
    // Compare the selected date with today
    if (queryState?.month > monthFormat) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        month: '',
      });
    }
  };
  useEffect(() => {
    validateFromEndDate();
  }, [queryState.month]);
  return (
    <>
      <DefaultDiv>
        <MonthlySettlementGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <MonthlySettlementGrid
            data={data}
            state={state}
            loading={loading}
            setState={setState}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
        </GridContainer>
        {/* <MonthlySettlementPopUp
          isModalOpen={isEditOpen}
          setIsModalOpen={setIsEditOpen}
        ></MonthlySettlementPopUp> */}
      </DefaultDiv>
    </>
  );
};
