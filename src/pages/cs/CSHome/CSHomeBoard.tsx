import { useState, useEffect } from 'react';
import { CSInfo, CSInfoCell, Card, Contain, DRow, MuteButton } from './style';
import {
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import { hdoInstance } from 'apis/hdoInstance';
import { Button } from 'components/common/Button/Button';

interface CSHomeBoardProps {
  extensionNumber: string;
  csState: string;
  sendMsg: (obj: any) => void;
  csPickupCall: (obj: any) => void;
  csEvent: string;
  holdingCall: number;
  isDetail: boolean;
}

interface CSStatistics {
  Ringing: number;
  Bridge: number;
  FailCall: number;
  HOL: number;
  APR: number;
  COM: number;
  TRA: number;
}

const CSHomeBoard: React.FC<CSHomeBoardProps> = ({
  extensionNumber,
  csState,
  sendMsg,
  csPickupCall,
  csEvent,
  holdingCall,
  isDetail,
}: CSHomeBoardProps) => {
  const [{ user }] = useRecoilState(userAuthState);

  const [statistics, setStatistics] = useState<CSStatistics>({
    Ringing: 0,
    Bridge: 0,
    FailCall: 0,
    HOL: 0,
    APR: 0,
    COM: 0,
    TRA: 0,
  });

  const bp = extensionNumber.length > 0 ? '0' : '20px';
  const [stateValue, setStateValue] = useState<number>();
  const [isMuted, setIsMuted] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>('0');

  const fetchStatistics = async (extensionNumber: string) => {
    const id = user?.id ?? '';
    const url = `/v1/web/cs-statistics?agentId=${extensionNumber}&consultantId=${id}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        setStatistics(result.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchRefundAmount = async () => {
    const id = user?.id ?? '';
    const today = new Date();
    const date = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    const url = `/v1/web/getRefundAmount?userId=${id}&date=${date}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        if (result.data[0]?.totalCancelAmount) {
          setRefundAmount(
            parseInt(result.data[0].totalCancelAmount, 10).toLocaleString(),
          );
        } else {
          setRefundAmount('0');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (extensionNumber) {
      void fetchStatistics(extensionNumber);
    }
    void fetchRefundAmount();
  }, [extensionNumber, csEvent]);

  useEffect(() => {
    void fetchRefundAmount();
  }, [stateValue]);
  return (
    <Card style={{ padding: `10px 20px ${bp} 20px` }}>
      {user?.Org.category === 'CS' && (
        <DRow>
          {extensionNumber.length > 0 && (
            <DRow style={{ marginTop: '13px' }}>
              상담사 상태변경
              <StyledSelectInput style={{ top: '-10px' }}>
                <StyledSelect
                  value={csState}
                  onChange={(value) => {
                    const values = {
                      action: 'SetAgentState',
                      option: Number(value),
                    };
                    sendMsg(values);
                    setStateValue(Number(value));
                  }}
                  style={{ pointerEvents: isDetail ? 'none' : 'auto' }}
                >
                  <Select.Option value="18">로그온</Select.Option>
                  <Select.Option value="1">대기</Select.Option>
                  <Select.Option value="2">자리비움</Select.Option>
                  <Select.Option value="3">상담</Select.Option>
                  <Select.Option value="5">식사</Select.Option>
                  <Select.Option value="6">교육</Select.Option>
                  <Select.Option value="7">후처리</Select.Option>
                  <Select.Option value="8">링울림</Select.Option>
                  <Select.Option value="11">감청</Select.Option>
                  <Select.Option value="13">회의</Select.Option>
                  <Select.Option value="14">휴식</Select.Option>
                  <Select.Option value="16">작업중</Select.Option>
                  <Select.Option value="17">다른업무</Select.Option>
                </StyledSelect>
              </StyledSelectInput>
            </DRow>
          )}

          <Contain position="left">
            <DRow style={{ marginBottom: '10px' }}>
              <CSInfo>
                <CSInfoCell type="title">개인 통화 현황</CSInfoCell>
                <CSInfoCell type="content">
                  <span>수신</span>
                  <span className="cl-complete">{statistics.Bridge}</span>
                </CSInfoCell>
                <CSInfoCell type="content">
                  <span>수신실패</span>
                  <span className="cl-outgoing">{statistics.FailCall}</span>
                </CSInfoCell>
                <CSInfoCell
                  type="content"
                  style={{
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    color: 'red',
                  }}
                >
                  <span>대기 콜 수</span>
                  <span className="cl-waiting">{holdingCall}</span>
                </CSInfoCell>
                <CSInfoCell type="content">
                  <Button onClick={csPickupCall} minWidth="100px">
                    당겨 받기
                  </Button>
                </CSInfoCell>
                {/* {(csState === '상담' || csState === '후처리') && ( */}
                {csState === '상담' && (
                  <CSInfoCell type="content">
                    <MuteButton
                      onClick={() => {
                        const values = {
                          action: 'MuteAudio',
                          option: isMuted ? 'off' : 'on',
                        };
                        sendMsg(values);
                        setIsMuted(!isMuted);
                      }}
                      isMuted={isMuted}
                      minWidth="100px"
                    >
                      {isMuted ? '음소거 OFF' : '음소거 ON'}
                    </MuteButton>
                  </CSInfoCell>
                )}
              </CSInfo>
              <div> </div>
              <CSInfo>
                <CSInfoCell type="title"> 개인 상담 현황</CSInfoCell>
                <CSInfoCell type="content">
                  <span>보류</span>
                  <span className="cl-complete">{statistics.HOL}</span>
                </CSInfoCell>
                <CSInfoCell type="content">
                  <span>이관</span>
                  <span>{statistics.TRA}</span>
                </CSInfoCell>
                <CSInfoCell type="content">
                  <span>처리 완료</span>
                  <span className="cl-unprocessed">{statistics.COM}</span>
                </CSInfoCell>
                {csState === '상담' && (
                  <CSInfoCell type="content">
                    <Button
                      onClick={() => {
                        const values = {
                          action: 'Hangup',
                        };
                        sendMsg(values);
                      }}
                      minWidth="100px"
                    >
                      통화종료
                    </Button>
                  </CSInfoCell>
                )}
              </CSInfo>
              <CSInfo>
                <CSInfoCell type="content">
                  <span>환불 현황</span>
                  <span className="cl-unprocessed">{refundAmount}원</span>
                </CSInfoCell>
              </CSInfo>
            </DRow>
          </Contain>
        </DRow>
      )}
    </Card>
  );
};

export default CSHomeBoard;
