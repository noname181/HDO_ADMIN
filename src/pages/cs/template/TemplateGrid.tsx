import { useState, useEffect } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import TemplateGridHeader from './TemplateGridHeader';
import TemplateGridTable from './TemplateGridTable';
import { type UnitPriceFilterInterface } from 'interfaces/ICharger';
import { type StateInterface } from 'interfaces/ICommon';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
const TemplateGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    scriptType: '',
    scriptCategory: '',
  });
  const {
    loading,
    error,
    data,
    totalCount,
    refetch,
  }: UseGetListResponse<UnitPriceFilterInterface> = useGetListWt({
    url: `/v1/ms-template?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&type=${queryState.scriptType}&category=${queryState.scriptCategory}`,
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
  }, [state]);
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      scriptType: '',
      scriptCategory: '',
    });
    refetch();
  };
  return (
    <DefaultDiv>
      <TemplateGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={refetch}
        reload={reload}
      />
      <TemplateGridTable
        queryState={queryState}
        setQueryState={setQueryState}
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        totalCount={totalCount}
      />
    </DefaultDiv>
  );
};
export default TemplateGrid;
