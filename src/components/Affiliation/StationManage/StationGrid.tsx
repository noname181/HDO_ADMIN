import { useEffect, useState } from 'react';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import StationGridHeader from './StationGridHeader';
import StationGridTable from './StationGridTable';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

const StationGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    area: '',
    branch: '',
    cate: '',
    closed: '',
  });

  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/orgs?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&area=${queryState.area}&branch=${queryState.branch}&closed=${queryState.closed}&cate=station&division=${queryState.cate}`,
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
    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      area: '',
      branch: '',
      cate: '',
      closed: '',
      // name: '',
      // contact: '',
    });
    setAreaNo('');
    refetch();
  };

  return (
    <DefaultDiv>
      <StationGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        setAreaNo={setAreaNo}
        areaNo={areaNo}
      />
      <StationGridTable
        loading={loading}
        data={data}
        totalCount={totalCount}
        state={state}
        setState={setState}
        queryState={queryState}
        setQueryState={setQueryState}
      />
    </DefaultDiv>
  );
};

export default StationGrid;
