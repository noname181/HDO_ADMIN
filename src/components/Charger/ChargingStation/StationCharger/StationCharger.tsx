import { ModalHeader } from 'components/common/Modal/Modal';
import { Button } from 'components/common/Button/Button';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { useGetListWtTrigger } from 'hooks/useGetListWt';
import { type StateInterface } from 'interfaces/ICommon';
import { StationChargerGrid } from './StationChargerGrid';
import { StationChargerEdit } from './StationChargerEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { StationChargerRegister } from './StationChargerRegister';

interface StationChargerProps {
  stationId: number | '';
  stationData: any;
  reload: () => void;
  isReadonlyALL?: boolean;
}

export const StationCharger = ({
  stationId,
  stationData,
  reload,
  isReadonlyALL,
}: StationChargerProps) => {
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [chargerId, setChargerId] = useState<number | ''>('');

  const { loading, error, data, getData, clearError } =
    useGetListWtTrigger<any>();

  const getChargerData = () => {
    void getData({
      url: `/charging-stations-manage/${stationId}/chargers-manage`,
    });
  };

  useEffect(() => {
    if (stationId !== '') {
      getChargerData();
    }
  }, [stationId]);

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setState({
        ...state,
        isSuccess: false,
      });
      getChargerData();
    }
    // console.log(state);
    if (state?.error) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);

  // api 호출 Error 일 때 AlertModal
  // useEffect(() => {
  //   if (error !== null) {
  //     setAlertModal({
  //       ...alertModal,
  //       open: true,
  //       type: 'error',
  //       title: 'API 호출 에러',
  //       content: error?.message || 'API 호출 에러',
  //     });
  //     clearError();
  //   }
  // }, [error]);
  // console.log(data);
  // console.log(stationData);
  return (
    <>
      <ModalHeader title="충전기 목록" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <Button color="reset">엑셀 다운로드</Button>
          <Button color="reset">단가 설정</Button> */}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button color="reset" onClick={getChargerData}>
            새로고침
          </Button>
          {!isReadonlyALL && (
            <StationChargerRegister
              reload={reload}
              stationId={stationId}
              state={state}
              setState={setState}
            />
          )}
        </div>
      </div>
      <StationChargerGrid
        loading={loading}
        data={data}
        setChargerId={setChargerId}
      />

      <StationChargerEdit
        reload={reload}
        state={state}
        setState={setState}
        chargerId={chargerId}
        setChargerId={setChargerId}
        isReadonlyALL={isReadonlyALL}
      />
    </>
  );
};
