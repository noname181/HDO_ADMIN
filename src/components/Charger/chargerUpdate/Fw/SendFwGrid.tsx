import { useEffect, useState } from 'react';
import { DefaultDiv } from 'styles/style';
import { type FWInterface } from 'interfaces/IChgUpdate';
import { useGetListWt } from 'hooks/useGetListWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { postApi } from 'apis/postApi';
import { type StateInterface } from 'interfaces/ICommon';
import { SendFwGridHeader } from './SendFwGridHeader';
import { SendFwGridTable } from './SendFwGridTable';

export const SendFWGrid = () => {
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    update: '',
    org: '',
  });

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, data, refetch, latestVer, totalCount } =
    useGetListWt<FWInterface>({
      url: `/charger-update/fw?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}&org=${queryState.org}`,
    });
  const [sendId, setSendId] = useState<number[] | string[]>([]);
  async function onFinish(val: any) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const sendData = {
      div: val.div,
      chargers: val.chargers,
      apiUrl: apiUrl,
    };

    await postApi(
      {
        url: `/charger-update/fw`,
        data: sendData,
      },
      setState,
    );
  }
  const sendBtn = (val: any) => {
    // onFinish(val).catch((error) => {
    //   console.error('Error in sendBtn:', error);
    // });
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
        },
      });
    }

    // console.log('dkfQksh', val);
  };
  const wrapSendBtn = () => {
    sendBtn({ div: 'fw', chargers: [...sendId] });
  };

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
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
      org: '',
    });
    setSendId([]);
    refetch();
  };

  return (
    <DefaultDiv>
      <SendFwGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        sendContents={wrapSendBtn}
        refetch={search}
        reload={reload}
      />
      <SendFwGridTable
        loading={loading}
        data={data}
        refetch={refetch}
        sendId={sendId}
        setSendId={setSendId}
        latestVer={latestVer}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
      />
    </DefaultDiv>
  );
};
