import { useEffect, useState } from 'react';
import { useGetListWt } from 'hooks/useGetListWt';
import { ChargerGridHeader } from './ChargerGridHeader';
import { DefaultDiv } from 'styles/style';
import ChargerGridTable from './ChargerGridTable';
import { useLocation } from 'react-router-dom';
import { hdoInstance } from 'apis/hdoInstance';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

const ChargerGrid = () => {
  const location = useLocation();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const url = location.pathname;
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [areaNo, setAreaNo] = useState('');
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  // const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [queryState, setQueryState] = useState({
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
    chg_use_yn: '',
    // isJam: '',
    cs_charging_state: '',
    charger_status: '',
    region: '',
  });

  const { loading, data, refetch, totalCount } = useGetListWt({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    url: `/chargers-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&area=${queryState.area}&branch=${queryState.branch}&org=${queryState.org}&chg_use_yn=${queryState.chg_use_yn}&cs_charging_state=${queryState.cs_charging_state}&charger_status=${queryState.charger_status}&region=${queryState.region}`,
  });

  // 그리드 업데이트 Row
  useEffect(() => {
    if (state.isSuccess) {
      // const grid = chargerGrid.current as AUIGrid;
      // grid.refreshRows(state.data.result, '', 0);

      reload();
      setState({
        isLoading: false,
        error: null,
        isSuccess: false,
        data: null,
      });
    }
  }, [state]);

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });

    refetch();
  };
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
      chg_use_yn: '',
      // isJam: '',
      cs_charging_state: '',
      charger_status: '',
      region: '',
    });
    setAreaNo('');
    refetch();
  };

  useEffect(() => {
    const intervalId = setInterval(function () {
      refetch();
      // console.log('refresh');
    }, 30000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      <ChargerGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <ChargerGridTable
        state={state}
        setState={setState}
        loading={loading}
        data={data}
        refetch={refetch}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
        reload={reload}
      />
    </DefaultDiv>
  );
};

export default ChargerGrid;
