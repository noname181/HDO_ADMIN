import { useEffect, useState } from 'react';

// api
import { useGetListWt, useGetListAll } from 'hooks/useGetListWt';

// 하위컴포넌트
import ChargingStationGridHeader from './ChargingStationGridHeader';
import ChargingStationGridTable from './ChargingStationGridTable';

// 타입
import { type StateInterface } from 'interfaces/ICommon';

import { type StationInterface } from 'interfaces/ICharger';

// 스타일
import { DefaultDiv } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const ChargingStationGrid = (location: any) => {
  // api 호출 데이터 상태
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isSuccess: false,
    error: null,
    isLoading: false,
  });
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [areaNo, setAreaNo] = useState('');
  location = location?.location;
  // console.log(location);
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: location?.state?.searchKey
      ? String(location?.state?.searchKey)
      : '',
    searchVal: location?.state?.searchVal
      ? String(location?.state?.searchVal)
      : '',
    startDate: '',
    endDate: '',
    area: '',
    branch: '',
    org: '',
    status: '',
    wash: '',
    region: '',
  });

  // 충전소 데이터 조회
  const { loading, data, refetch, totalCount } =
    useGetListAll<StationInterface>({
      location: '/charging-station',
      url:
        `/charging-stations-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}` +
        `&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}` +
        `&area=${queryState.area}&branch=${queryState.branch}&org=${queryState.org}&status=${queryState.status}&wash=${queryState.wash}&region=${queryState.region}`,
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
      setQueryState({
        rpp: 50,
        page: 0,
        odby: 'DESC',
        searchKey: '',
        searchVal: '',
        startDate: '',
        endDate: '',
        area: '',
        branch: '',
        org: '',
        status: '',
        wash: '',
        region: '',
      });
      setState({
        ...state,
        isSuccess: false,
      });
      // api 재호출
      setCheckRowId([]);

      refetch();
    }
  }, [state]);

  const search = (queryState_: any) => {
    if (queryState_?.searchKey ?? queryState_?.searchVal) {
      setQueryState({
        ...queryState_,
        rpp: 50,
        page: 0,
        odby: 'DESC',
      });
    } else {
      setQueryState({
        ...queryState,
        rpp: 50,
        page: 0,
        odby: 'DESC',
      });
    }
    setCheckRowId([]);

    refetch();
  };
  window.addEventListener('beforeunload', (event) => {
    window.history.replaceState({}, queryState.searchKey);
  });
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      startDate: '',
      endDate: '',
      area: '',
      branch: '',
      org: '',
      status: '',
      wash: '',
      region: '',
    });
    setCheckRowId([]);
    setAreaNo('');
    refetch();
  };
  useEffect(() => {
    if (location?.state?.searchKey === 'chgs_name') {
      setQueryState({
        ...queryState,
        searchKey: location?.state?.searchKey,
        searchVal: location?.state?.searchVal,
      });
      search({
        ...queryState,
        searchKey: location?.state?.searchKey,
        searchVal: location?.state?.searchVal,
      });

      // api 재호출
    }
  }, [location]);
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
      <ChargingStationGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <ChargingStationGridTable
        loading={loading}
        data={data}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
        state={state}
        setState={setState}
        setCheckRowId={setCheckRowId}
        checkRowId={checkRowId}
        reload={reload}
      />
    </DefaultDiv>
  );
};

export default ChargingStationGrid;
