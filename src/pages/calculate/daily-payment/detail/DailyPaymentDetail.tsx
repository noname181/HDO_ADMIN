import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { DefaultDiv, GridContainer } from 'styles/style';
import { useGetListAll, useGetListWt } from 'hooks/useGetListWt';
import { useLocation } from 'react-router-dom';
import DailyPaymentDetailGridHeader from './DailyPaymentDetailGridHeader';
import DailyPaymentDetailGrid from './DailyPaymentDetailGrid';
import { hdoInstance } from 'apis/hdoInstance';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type IDailyPayment } from 'interfaces/ICommon';

export const DailyPaymentDetail = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const location = useLocation();
  const url = location?.pathname;
  const part = url.split('/');
  const key = part[2];
  const [data2, setData2] = useState([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    // division: '',
    startDate: '',
    endDate: '',
    area: '',
    branch: '',
  });
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    axios(
      `/daily-payment?rpp=1&page=${queryState.page}&odby=${queryState.odby}&endDate=${key}&startDate=${key}`,
      {
        headers: {
          location: '/daily-payment',
          Authorization: accessToken,
        },
      },
    )
      .then((result: any) => {
        setData2(result?.data?.result?.[0]);
        // console.log(result?.data?.result?.[0]);
      })
      .catch((error) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
        console.log(error);
      });
  }, []);
  // const { loading, data, refetch, totalCount } = useGetListAll<any>({
  //   location: '/daily-payment',
  //   url: `/daily-payment-detail?rpp=1&page=${queryState.page}&odby=${queryState.odby}&endDate=${key}&startDate=${key}&division=${queryState.division}`,
  // });
  const {
    loading,
    error,
    data,
    dataAll,
    refetch,
    totalCount,
  }: UseGetListResponse<IDailyPayment> = useGetListWt({
    location: '/daily-payment',
    url: `/daily-payment-detail?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&date=${key}&area=${queryState.area}&branch=${queryState.branch}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}`,
  });
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });

    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      // division: '',
      startDate: '',
      endDate: '',
      area: '',
      branch: '',
    });
    setAreaNo('');
    refetch();
  };
  useEffect(() => {
    if (state.isSuccess) {
      // const grid = chargerGrid.current as AUIGrid;
      // grid.refreshRows(state.data.result, '', 0);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      reload();
      setState({
        isLoading: false,
        error: null,
        isSuccess: false,
        data: null,
      });
    }
  }, [state]);

  return (
    <DefaultDiv>
      <DailyPaymentDetailGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <GridContainer height="calc(100vh - 15.7rem)">
        <DailyPaymentDetailGrid
          data={data}
          dataAll={dataAll}
          data2={data2}
          keydata={key}
          state={state}
          setState={setState}
          loading={loading}
          totalCount={totalCount}
          queryState={queryState}
          setQueryState={setQueryState}
          reload={reload}
        />
      </GridContainer>
    </DefaultDiv>
  );
};
