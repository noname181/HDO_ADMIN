import { useState, useEffect } from 'react';

import { useGetListWt } from 'hooks/useGetListWt';
import { type MobileInterface } from 'interfaces/Test/IUser';
import MobileUserGridHeader from './MobileUserGridHeader';
import MobileUserGridTable from './MobileUserGridTable';
import { DefaultDiv } from 'styles/style';
import { EditMobileUser } from './EditMobileUser';
import { EditDeliveryInfo } from './EditDeliveryInfo';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { CarManager } from './CarManager';

const MobileUserGrid = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [isRegistCoporation, setIsRegistCoporation] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isEditDeliveryInfo, setIsEditDeliveryInfo] = useState<boolean>(false);
  const [isCarManagerOpen, setIsCarManagerOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [userId, setUserid] = useState<number | ''>('');
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
    startDate: '',
    endDate: '',
    category: '',
  });

  const { loading, totalCount, data, refetch } = useGetListWt<MobileInterface>({
    url: `/v1/web/users?userType=mobile&rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&org=${queryState.category}`,
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
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    setCheckRowId([]);

    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
      startDate: '',
      endDate: '',
      category: '',
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
      <MobileUserGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setIsRegistCoporation={setIsRegistCoporation}
        setIsEditDeliveryInfo={setIsEditDeliveryInfo}
      />
      <MobileUserGridTable
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        queryState={queryState}
        setQueryState={setQueryState}
        setUserid={setUserid}
        setIsEditOpen={setIsEditOpen}
        setIsRegistCoporation={setIsRegistCoporation}
        isRegistCoporation={isRegistCoporation}
        refetch={refetch}
        totalCount={totalCount}
        setCheckRowId={setCheckRowId}
        checkRowId={checkRowId}
      />
      {/* <RegisterCoporation
        setIsRegistCoporation={setIsRegistCoporation}
        isRegistCoporation={isRegistCoporation}
        state={state}
        setState={setState}
        refetch={refetch}
      /> */}
      <EditMobileUser
        queryState={queryState}
        state={state}
        setState={setState}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        setIsCarManagerOpen={setIsCarManagerOpen}
        setUserid={setUserid}
        userId={userId}
        refetch={refetch}
      />
      <EditDeliveryInfo
        state={state}
        setState={setState}
        isEditDeliveryInfo={isEditDeliveryInfo}
        setIsEditDeliveryInfo={setIsEditDeliveryInfo}
        setUserid={setUserid}
        userId={userId}
      />
      <CarManager
        queryState={queryState}
        state={state}
        setState={setState}
        isCarManagerOpen={isCarManagerOpen}
        setIsCarManagerOpen={setIsCarManagerOpen}
        setUserid={setUserid}
        userId={userId}
        refetch={refetch}
      />
    </DefaultDiv>
  );
};

export default MobileUserGrid;
