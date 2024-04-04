import { useState, useRef, useEffect } from 'react';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';
import { hdoInstance } from 'apis/hdoInstance';
import CSHomeBoard from './CSHomeBoard';
import CSHomeDetail from './Detail/CSHomeDetail';
import CSHomeList from './List/CSHomeList';
import Tabs from 'components/common/Tab/Tabs';
import { userAuthState, isLoggedInState } from 'recoil/authState';
import { type CSHomeDetailMethods } from 'interfaces/ICS';

interface ICallInfo {
  ktApiId1: string;
  ktApiId2: string;
  callStartTime: string;
  callEndTime: string;
  csCls1: string;
  csCls2: string;
  phoneNo: string;
  recordFile: string;
}

interface CsDataType {
  call_type?: number;
  type?: string;
  reason?: string;
  channel?: string;
  causeTxt?: string;
  data?: string;
}

const CSHome = () => {
  const [{ user }] = useRecoilState(userAuthState);
  const orgName = user?.Org?.name ?? '';
  let extensionNumber = '';
  if (orgName.indexOf('/') > -1) {
    extensionNumber = orgName.split('/').pop();
  }

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  /** 웹프로토콜 확인 */
  // const webSocketUrl = `wss://211.253.36.82:8060/ws/?agent_id=${extensionNumber}`;
  const webSocketUrl = `wss://ktapi-evnu.oilbank.co.kr:8060/ws/?agent_id=${extensionNumber}`;
  const ws = useRef<WebSocket | null>(null);
  const isLoggedIn: boolean = useRecoilValue(isLoggedInState);
  const isAlive = useRef<boolean>(false);
  const pulse = useRef<number>(0);
  let values;

  const [csState, setCsState] = useState<string>('');
  const [callInfo, setCallInfo] = useState<ICallInfo>({
    ktApiId1: '',
    ktApiId2: '',
    callStartTime: '',
    callEndTime: '',
    csCls1: '',
    csCls2: '',
    phoneNo: '',
    recordFile: '',
  });
  const [csEvent, setCsEvent] = useState<string>('');
  const [csData, setCsData] = useState<CsDataType | null>(null);
  const [response, setResponse] = useState<string>('');
  const [callType, setCallType] = useState<number>(1);
  const [uniqueId, setUniqueId] = useState<string>('');
  const [recordFile, setRecordFile] = useState<string>('');
  const [cid, setCid] = useState<string>('');
  const [holdingCall, setHoldingCall] = useState<number>(0);

  const [regNo, setRegNo] = useState<string | null>('');
  const [idParam, setIdParam] = useState<string | null>(null);
  const [flagParam, setFlagParam] = useState<string | null>(null);
  const [incomingParam, setIncomingParam] = useState<string | null>(null);
  const [pullCalling, setPullCalling] = useState('nomal');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gubunParam = queryParams.get('gubun');
  const id = queryParams.get('id');
  const regNoParam = queryParams.get('regNoParam');

  const ringTimeoutRef = useRef<number | null>(null);
  const detailRef = useRef<CSHomeDetailMethods>(null);

  const [isDetail, setIsDetail] = useState<boolean>(false);
  useEffect(() => {
    if (gubunParam === 'reg') {
      setIsDetail(true);
      setRegNo(createRegNo());
      setFlagParam('reg');
      setIncomingParam('MAN');
    } else if (gubunParam === 'detail') {
      setIdParam(id);
      setRegNo(regNoParam);
      setIsDetail(true);
      setFlagParam('detail');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gubunParam]);

  useEffect(() => {
    if (location.pathname === '/cs-home' && location.search === '') {
      setIsDetail(false);
    } else {
      setIsDetail(true);
    }
  }, [location.pathname, location.search]);

  function checkAlive() {
    if (!isAlive.current) return ws?.current?.close();
    if (ws?.current?.readyState === ws?.current?.OPEN) {
      values = JSON.stringify({
        action: 'Ping',
      });
      ws?.current?.send(values);
    } else {
      isAlive.current = false;
    }
  }

  function sendMsg(obj: any) {
    ws?.current?.send(JSON.stringify(obj));
  }

  function createRegNo() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');

    const formattedRegNo = `${yyyy}${mm}${dd}${HH}${MM}${SS}`;
    return formattedRegNo;
  }

  function getDatetime() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');

    const formattedDatetime = `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
    // regNo 상태를 업데이트합니다.
    // 만약 regNo가 상태로 관리되고 있다면, 해당 상태를 업데이트하는 함수를 호출해야 합니다.
    return formattedDatetime;
  }

  useEffect(() => {
    // 내선번호가 있으면 소켓연결
    if (extensionNumber.length > 0) {
      if (!ws.current) {
        ws.current = new WebSocket(webSocketUrl);

        ws.current.onopen = () => {
          isAlive.current = true;
          clearInterval(pulse.current);
          pulse.current = window.setInterval(function () {
            checkAlive();
          }, 1000 * 60 * 2);
        };
        ws.current.onclose = (error) => {
          console.log(error);
          /** 웹소켓 재연결 요청 */
          setTimeout(function () {
            ws.current = new WebSocket(webSocketUrl);
          }, 5000);
        };
        ws.current.onerror = (error) => {
          console.log(error);
        };
        ws.current.onmessage = (evt: MessageEvent) => {
          const msg = JSON.parse(evt.data);
          if (msg.event) {
            setCsEvent(msg.event);
            setCsData(msg.data);
            if (msg.event === 'QueueCount') {
              setHoldingCall(msg.count);
            } else if (msg.event === 'SetAgentStateAction') {
              setCsState(msg.data.state_name_kr);
              setResponse(msg.response);
            } else if (msg.event === 'GetAgentStateAction') {
              setCsState(msg.data.item[0].state_name_kr);
              alert(msg.data.item[0].state_name_kr);
            } else if (
              msg.event === 'Ringing' ||
              msg.event === 'Bridge' ||
              msg.event === 'Hangup'
            ) {
              setCallType(msg.data.call_type);
              setCid(msg.data.cid);
              setUniqueId(msg.data.unique_id);
              setRecordFile(msg.data.record_file);
              // 전화가 오면 모달창 뛰움
              if (msg.event === 'Ringing' && msg.data.call_type === 1) {
                if (ringTimeoutRef.current) {
                  clearTimeout(ringTimeoutRef.current);
                }
                setRegNo(createRegNo()); // 임시로 접수번호 생성
                handleHelpLine(
                  msg.data.cid,
                  msg.data.queue_name.substring(
                    0,
                    msg.data.queue_name.length - 2,
                  ),
                );
              }
              if (msg.event === 'Bridge' && msg.data.call_type === 1) {
                if (regNo === '') {
                  setRegNo(createRegNo());
                }
                setIsDetail(true);
                // navigate(`/cs-home?gubun=reg`);
                setFlagParam('reg');
                setIncomingParam('CTP');
                setCallInfo((prev) => ({
                  ...prev,
                  ktApiId1: extensionNumber,
                  ktApiId2: msg.data.unique_id,
                  csCls1: msg.data.queue_name.substring(
                    0,
                    msg.data.queue_name.indexOf(' '),
                  ),
                  csCls2: msg.data.queue_name.substring(
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    msg.data.queue_name.indexOf(' ') + 1,
                    msg.data.queue_name.length - 2,
                  ),
                  phoneNo: msg.data.cid,
                  recordFile: msg.data.record_file,
                  callStartTime: getDatetime(),
                }));
                setAlertModal({
                  ...alertModal,
                  open: false,
                });
              }
              if (msg.event === 'Hangup' && msg.data.call_type === 1) {
                setCallInfo((prev) => ({
                  ...prev,
                  callEndTime: getDatetime(),
                }));
                setAlertModal({
                  ...alertModal,
                  open: false,
                });
                if (msg.data['cause-txt']) {
                  setCsData((prev) => ({
                    ...prev,
                    causeTxt: msg.data['cause-txt'],
                  }));
                  const values = {
                    action: 'SetAgentState',
                    option: Number(1),
                  };
                  sendMsg(values);
                }
              }
            }
          }
        };
      }
    }
    return () => {
      if (isAlive.current) {
        clearInterval(pulse.current);
        const values = {
          action: 'SetAgentState',
          option: Number(0),
        };
        sendMsg(values);
        ws?.current?.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saveCsCallLogLogOut = async () => {
      const formData = {
        regNo,
        agentId: user?.id,
        csEvent: 'SetAgentState',
        csState: '로그아웃',
        callType,
        cid,
        uniqueId,
        recordFile,
        extensionNumber,
      };
      const url = `/v1/web/cs-call-log`;
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const hdoAxios = hdoInstance();
      await hdoAxios.post(url, formData, {
        headers: {
          Authorization: accessToken,
        },
      });
    };
    const logOutOnUnmount = async () => {
      try {
        await saveCsCallLogLogOut();
      } catch (error) {
        console.error('로그아웃 로깅 실패', error);
      }
    };
    if (!isLoggedIn) {
      void logOutOnUnmount();
    }
    return () => {
      if (!isLoggedIn) {
        void logOutOnUnmount();
      }
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const saveCsCallLog = async () => {
      const formData = {
        regNo,
        agentId: user?.id,
        csEvent,
        csState,
        callType,
        cid,
        uniqueId,
        recordFile,
        extensionNumber,
      };
      const url = `/v1/web/cs-call-log`;
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const hdoAxios = hdoInstance();
      await hdoAxios.post(url, formData, {
        headers: {
          Authorization: accessToken,
        },
      });
    };

    if (
      (csEvent === 'SetAgentStateAction' && response === 'Success') ||
      csEvent === 'Ringing' ||
      csEvent === 'Bridge' ||
      csEvent === 'Hangup' ||
      csEvent === 'Pickup'
    ) {
      if (csData?.causeTxt !== 'Answered elsewhere') {
        void saveCsCallLog();
      }
    }

    if (csEvent === 'Bridge' && callType === 1 && alertModal.open) {
      setAlertModal({
        ...alertModal,
        open: false,
      });
    }
  }, [csEvent, csState, callType]);

  const handleHelpLine = (phone: string, subject: string) => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '상담 전화',
      content: `${phone}: ${subject}`,
      okText: '전화 받기',
      onOk() {
        values = {
          action: 'Answer',
        };
        ws?.current?.send(JSON.stringify(values));
      },
      onCancel() {
        values = {
          action: 'Hangup',
        };
        ws?.current?.send(JSON.stringify(values));
        setAlertModal({
          ...alertModal,
          open: false,
        });
      },
    });
  };

  useEffect(() => {
    if (pullCalling === 'saved') {
      const callValues = {
        action: 'SetAgentState',
        option: 1,
      };
      sendMsg(callValues);
      ringTimeoutRef.current = window.setTimeout(() => {
        const values = {
          action: 'PickupCall',
        };
        ws?.current?.send(JSON.stringify(values));
      }, 1000);
    } else if (pullCalling === 'pullCalling') {
      if (flagParam === 'reg') {
        detailRef.current?.handleSave();
      } else if (flagParam === 'detail') {
        detailRef.current?.handleModify();
      }
    }
  }, [pullCalling]);

  function csPickupCall() {
    if (isDetail) {
      if (flagParam === 'reg') {
        setPullCalling('pullCalling');
      } else if (flagParam === 'detail') {
        setPullCalling('pullCalling');
      }
    } else {
      const callValues = {
        action: 'SetAgentState',
        option: 1,
      };
      sendMsg(callValues);
      ringTimeoutRef.current = window.setTimeout(() => {
        const values = {
          action: 'PickupCall',
        };
        ws?.current?.send(JSON.stringify(values));
      }, 1000);
    }
  }

  return (
    <>
      {extensionNumber.length > 0 && (
        <CSHomeBoard
          extensionNumber={extensionNumber}
          csState={csState}
          sendMsg={sendMsg}
          csPickupCall={csPickupCall}
          csEvent={csEvent}
          holdingCall={holdingCall}
          isDetail={isDetail}
        />
      )}
      <Tabs defaultValue="1">
        <Tabs.List absolute>
          <Tabs.Trigger
            value="1"
            text={isDetail ? '상담 내역 등록/ 수정' : '상담 목록'}
          />
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            {isDetail ? (
              <CSHomeDetail
                ref={detailRef}
                idParam={idParam}
                regNoParam={regNo}
                flagParam={flagParam}
                incomingParam={incomingParam}
                callInfo={callInfo}
                isDetail={isDetail}
                setFlagParam={setFlagParam}
                sendMsg={sendMsg}
                extensionNumber={extensionNumber}
                setIdParam={setIdParam}
                setIsDetail={setIsDetail}
                setPullCalling={setPullCalling}
                pullCalling={pullCalling}
              />
            ) : (
              <CSHomeList
                setIsDetail={setIsDetail}
                setFlagParam={setFlagParam}
                setRegNo={setRegNo}
              />
            )}
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default CSHome;
