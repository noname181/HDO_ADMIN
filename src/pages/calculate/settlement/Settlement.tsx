import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type SetStateAction,
  type Dispatch,
} from 'react';
import SettlementGrid from './SettlementGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';

import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type ISettlement, type StateInterface } from 'interfaces/ICommon';
import SettlementGridHeader from './SettlementGridHeader';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
// import SalesDetailPopUp from './SalesDetailPopUp';

interface Props {
  search?: boolean;
  contentInput: string;
  setcontentInput: Dispatch<SetStateAction<string | ''>>;
}
export const Settlement = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [SettlementId, setSettlementId] = useState<number | ''>('');
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
  const getLastMonth = new Date();
  getLastMonth.setMonth(getLastMonth.getMonth() - 1);
  const yearLastMonth = String(getLastMonth.getFullYear());
  const monthLastMonth = String(getLastMonth.getMonth() + 1).padStart(2, '0');
  const daylastMonth = String(getLastMonth.getDate()).padStart(2, '0');
  const lastmonth = `${yearLastMonth}-${monthLastMonth}-${daylastMonth}`;
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
    endDate: today,
    startDate: lastmonth,
    division: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<ISettlement> = useGetListWt({
    url: `/settlement?rpp=${queryState.rpp}&page=${queryState.page}&odby=${
      queryState.odby
    }&class=${queryState.class}&endDate=${queryState.endDate.replaceAll(
      '-',
      '',
    )}&startDate=${queryState.startDate.replaceAll('-', '')}&division=${
      queryState.division
    }`,
  });
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      class: '',
      paymentMethod: '',
      endDate: today,
      startDate: lastmonth,
      division: '',
    });
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
      setState({
        ...state,
        isSuccess: false,
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
        startDate: lastmonth,
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
        <SettlementGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          reload={reload}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <SettlementGrid
            data={data}
            state={state}
            loading={loading}
            setState={setState}
            // setIsEditOpen={setIsEditOpen}
            setSettlementId={setSettlementId}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
        </GridContainer>
        {/* <SalesDetailPopUp
          isModalOpen={isEditOpen}
          setIsModalOpen={setIsEditOpen}
        ></SalesDetailPopUp> */}
      </DefaultDiv>
    </>
  );
};
