import { useState, useEffect } from 'react';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { DefaultDiv } from 'styles/style';
import UnitPriceGridHeader from './UnitPriceGridHeader';
import UnitPriceGridTable from './UnitPriceGridTable';
import { type UnitPriceFilterInterface } from 'interfaces/ICharger';
import { type StateInterface } from 'interfaces/ICommon';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
const UnitPriceGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [queryState, setQueryState] = useState<UnitPriceFilterInterface>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    unitPriceSetName: '',
  });
  const {
    loading,
    error,
    data,
    totalCount,
    refetch,
  }: UseGetListResponse<UnitPriceFilterInterface> = useGetListWt({
    url: `/v1/unit-price-set?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&unitPriceSetName=${queryState.unitPriceSetName}`,
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
      page: 0,
      odby: 'DESC',
      isUsed: '',
      unitPriceSetName: '',
    });
    refetch();
  };
  // console.log(queryState.unitPriceSetName);
  // console.log(data);
  return (
    <DefaultDiv>
      <UnitPriceGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={refetch}
        reload={reload}
      />
      <UnitPriceGridTable
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
export default UnitPriceGrid;
