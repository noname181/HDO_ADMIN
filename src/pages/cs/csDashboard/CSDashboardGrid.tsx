import { BoardContain, BoardBox, BoardRow } from './styled';
import { CallsTable, CSCallsTable } from './CSCallsTable';
import { ChartDailyCall, ChartResponseRate } from './Chart';
import CounselorGribtable from './CounselorGribtable';
import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card } from '../CSHome/style';
import { hdoInstance } from 'apis/hdoInstance';
import { Spinner } from 'styles/style';
import axios from 'axios';

interface gridDataInterface {
  BridgeCount: string;
  NAME: string;
  agentId: number;
  csState: string;
  extensionNumber: string;
  id: number;
  logDate: string;
  messageCount: number;
  refundAmount: number;
  refundCount: number;
}

interface ktApiDataInterface {
  in_total_cnt: number | null;
  in_success_cnt: number | null;
  in_success_per: number | null;
  give_up_cnt: number | null;
}

interface consultationInterface {
  ALLCount: number | 0;
  APP: number | 0;
  BRK: number | 0;
  CHG: number | 0;
  ETC: number | 0;
  PAY: number | 0;
  REG: number | 0;
}

const CSDashboardGrid = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [date, setDate] = useState<string | null>(today);
  const [gridData, setGridData] = useState<gridDataInterface[] | null>(null);
  const [ktApiData, setKtApiData] = useState<ktApiDataInterface[] | null>(null);
  const [consultationData, setConsultationData] = useState<
    consultationInterface[] | null
  >(null);
  const [timeData, setTimeData] = useState();
  const [loading, setLoading] = useState(false);

  const callKtAPI = async () => {
    // const url = `https://211.253.36.82:8100/api/v1/cdr-stat?tenants_id=1&start_date=${date}`;
    const url = `https://ktapi-evnu.oilbank.co.kr:8100/api/v1/cdr-stat?tenants_id=1&start_date=${date}`;
    await axios(url)
      .then((result) => {
        setKtApiData(result?.data.item[0]);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getBoardData = async () => {
    setLoading(true);
    const url = `v1/web/cs-dashBoard?selectedDate=${date}`;
    // const url = `v1/web/cs-dashBoard?selectedDate=2023-12-11`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        if (result?.data?.gridData) {
          setGridData(result.data.gridData);
        }
        if (result?.data?.timeTable) {
          setTimeData(result.data.timeTable);
        }
        if (result?.data?.consultation[0]) {
          setConsultationData(result.data.consultation[0]);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    void getBoardData();
    void callKtAPI();
  }, [date]);

  return (
    <>
      <Card style={{ position: 'relative', width: '100%' }}>
        <StyledInputDate style={{ width: 260 }}>
          <label style={{ width: '70px', minWidth: 'unset' }}>대시보드</label>
          <DatePicker
            style={{ width: 'calc(100% - 70px)' }}
            format="YYYY-MM-DD"
            picker="date"
            placeholder="YYYY-MM-DD"
            value={date ? dayjs(date) : null}
            onChange={(value) => {
              setDate(value ? dayjs(value).format('YYYY-MM-DD') : '');
            }}
          />
        </StyledInputDate>
      </Card>

      <BoardContain style={{ marginTop: 0, height: 'calc(100% - 115px' }}>
        <BoardRow>
          <BoardBox position="left">
            <CallsTable ktApiData={ktApiData} loading={loading} />
          </BoardBox>
          <BoardBox position="right">
            <ChartResponseRate ktApiData={ktApiData} />
          </BoardBox>
        </BoardRow>

        <CSCallsTable consultationData={consultationData} />

        <CounselorGribtable data={gridData} loading={loading} />

        <ChartDailyCall timeData={timeData} />
      </BoardContain>
    </>
  );
};
export default CSDashboardGrid;
