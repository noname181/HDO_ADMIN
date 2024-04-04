import { useState, useEffect } from 'react';

// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 타입
import { type StateInterface } from 'interfaces/ICommon';
// 스타일
import { DefaultDiv } from 'styles/style';

import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type CarWashFilterInterface } from 'interfaces/IFilter';
import { useGetListWt } from 'hooks/useGetListWt';
import { CarWashGridTable } from './CarWashGridTable';
import { CarWashGridHeader } from './CarWashGridHeader';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

export const CarWashGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // api 호출 데이터 상태
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [queryState, setQueryState] = useState<CarWashFilterInterface>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    car_number: '',
  });

  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<StateInterface> = useGetListWt({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    url: `/v1/car-wash?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&car_number=${queryState.car_number}`,
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
      car_number: '',
    });
    refetch();
  };
  // console.log(data);
  return (
    <>
      <DefaultDiv>
        <CarWashGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          reload={reload}
        />
        <CarWashGridTable
          loading={loading}
          data={data}
          state={state}
          setState={setState}
          queryState={queryState}
          setQueryState={setQueryState}
          totalCount={totalCount}
        />
      </DefaultDiv>
    </>
  );
};
// export default BonusCard;
