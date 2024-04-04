import { useEffect, useState } from 'react';
import { DefaultDiv } from 'styles/style';

import { type UpdateInterface } from 'interfaces/IChgUpdate';
import { useGetListWt } from 'hooks/useGetListWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
import { postApi } from 'apis/postApi';
import { SendAdGridHeader } from './SendAdGridHeader';
import { SendAdGridTable } from './SendAdGridTable';

import { AdTransmission } from './Model/AdTransmission';

export const SendAdGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chargerData, setChargerData] = useState<any[]>([]);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    update: '',
  });

  const { loading, data, refetch, latestVer, totalCount } =
    useGetListWt<UpdateInterface>({
      url: `/charger-update/ad?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}`,
    });
  const [sendId, setSendId] = useState<number[] | string[]>([]);

  async function onFinish(val: any) {
    const sendData = {
      div: val.div,
      chargers: val.chargers,
    };

    await postApi(
      {
        url: `/charger-update`,
        data: sendData,
      },
      setState,
    );
  }
  const sendBtn = (val: any) => {
    if (sendId.length === 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '안내' ?? 'api 호출 에러 : 콘솔창 확인',
        content: '대상을 선택하세요.' ?? 'api 호출 에러 : 콘솔창 확인',
      });
    } else {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'alert',
        title: '알림',
        content: '정말로 전송할까요?',
        onOk() {
          onFinish(val).catch((error) => {
            console.error('Error in sendBtn:', error);
          });

          setAlertModal({ ...alertModal, open: false });
          setChargerData([]);
          setSendId([]);
        },
      });
    }

    // console.log('dkfQksh', val);
  };
  const wrapSendBtn = () => {
    sendBtn({ div: 'ad', chargers: [...sendId] });
  };
  // const setAlertModalState = useSetRecoilState(alertModalState);

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setChargerData([]);
      setSendId([]);
      reload();
      setState({
        ...state,
        isSuccess: false,
      });
    }
    if (state.error) {
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

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });
    setSendId([]);
    setChargerData([]);
    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50, // 1page data 조회 갯수
      page: 0, // rpp에 따른 조회 페이지 번호
      odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
      searchKey: '',
      searchVal: '',
      startDate: '',
      endDate: '',
      update: '',
    });
    setSendId([]);
    setChargerData([]);
    refetch();
  };
  const handleOpenModel = () => {
    if (sendId.length === 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '안내' ?? 'api 호출 에러 : 콘솔창 확인',
        content: '대상을 선택하세요.' ?? 'api 호출 에러 : 콘솔창 확인',
      });
    } else {
      setIsModalOpen(true);
    }
  };
  return (
    <DefaultDiv>
      <SendAdGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        sendContents={handleOpenModel}
      />
      <SendAdGridTable
        loading={loading}
        data={data}
        sendId={sendId}
        setSendId={setSendId}
        setChargerData={setChargerData}
        latestVer={latestVer}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
      />
      <AdTransmission
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        chargerData={chargerData}
        setChargerData={setChargerData}
        state={state}
        setState={setState}
        setSendId={setSendId}
      />
    </DefaultDiv>
  );
};
