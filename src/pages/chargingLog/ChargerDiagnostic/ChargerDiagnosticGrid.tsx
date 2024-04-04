import { useEffect, useState } from 'react';
import { DefaultDiv } from 'styles/style';

import {
  type UpdateInterface,
  type UpdateFilterInterface,
} from 'interfaces/IChgUpdate';
import { useGetListWt } from 'hooks/useGetListWt';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
import { postApi } from 'apis/postApi';
import { DiagnosticGridHeader } from './ChargerDiagnosticGridHeader';
import { ChargerDiagnosticGridTable } from './ChargerDiagnosticGridTable';
import dayjs from 'dayjs';

export const ChargerDiagnosticGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  var oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Extract hours and minutes from the new date object
  const hours = oneHourAgo.getHours();
  const minutes = oneHourAgo.getMinutes();
  const formattedTime =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0');
  var hoursNow = now.getHours();
  var minutesNow = now.getMinutes();
  var currentTime =
    hoursNow.toString().padStart(2, '0') +
    ':' +
    minutesNow.toString().padStart(2, '0');

  const [queryState, setQueryState] = useState({
    rpp: 50, // 1page data 조회 갯수
    page: 0, // rpp에 따른 조회 페이지 번호
    odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    update: '',
    clause_version: '',
    // user_id: '',
    // user_name: '',
    // phone: '',
  });
  const [queryStateTime, setQueryStateTime] = useState({
    dateStart: today,
    dateStop: today,
    timeStart: today + formattedTime,
    timeStop: today + currentTime,
  });
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const { loading, data, refetch, latestVer, totalCount } =
    useGetListWt<UpdateInterface>({
      url: `/charger-diagnostic?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}&clause_version=${queryState.clause_version}`,
    });
  const [sendId, setSendId] = useState<number[] | string[]>([]);
  const [chargerData, setChargerData] = useState<any[]>([]);

  async function onFinish(val: any) {
    const sendData = {
      chargers: val.chargers,
      startTime:
        queryStateTime?.dateStart +
        ' ' +
        dayjs(queryStateTime.timeStart).format('HH:mm'),
      stopTime:
        queryStateTime?.dateStop +
        ' ' +
        dayjs(queryStateTime.timeStop).format('HH:mm'),
    };

    await postApi(
      {
        url: `/charger-diagnostic`,
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
  };

  const wrapSendBtn = () => {
    sendBtn({ chargers: [...sendId] });
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
      setChargerData([]);
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
      clause_version: '',
    });
    setSendId([]);

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
      <DiagnosticGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
        sendContents={wrapSendBtn}
        setQueryStateTime={setQueryStateTime}
        queryStateTime={queryStateTime}
      />
      <ChargerDiagnosticGridTable
        loading={loading}
        data={data}
        setSendId={setSendId}
        sendId={sendId}
        latestVer={latestVer}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
        setChargerData={setChargerData}
      />
      {/* <DiagnosticModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    </DefaultDiv>
  );
};
