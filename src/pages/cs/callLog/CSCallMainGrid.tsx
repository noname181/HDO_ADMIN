import { useEffect, useRef, useState } from 'react';
import { type StateInterface } from 'interfaces/ICommon';
import { DatePicker, Select, ConfigProvider } from 'antd';
import moment from 'moment';
import {
  DefaultDiv,
  GridHeader,
  GridRefetch,
  GridHeaderItem,
  type GridHeaderItemProps,
} from 'styles/style';

import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import CSCallMainGridTable from './CSCallMainGridTable';
import dayjs from 'dayjs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useLocation, useNavigate } from 'react-router-dom';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListAll, useGetListWt } from 'hooks/useGetListWt';
import { type Result } from 'interfaces/IConsultant';
import { userAuthState } from 'recoil/authState';
import axios from 'axios';

interface callLogFilterInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'desc' | 'asc'; // 정렬순서 default desc 내림차순 <-> asc 오름차순
  searchVal: string;
  startDate: string;
  endDate: string;
}
const CSCallMainGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [queryState, setQueryState] = useState<callLogFilterInterface>({
    rpp: 50,
    page: 1,
    odby: 'desc',
    searchVal: '',
    startDate: '',
    endDate: '',
  });

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'desc',
      searchVal: '',
      startDate: '',
      endDate: '',
    });
    void dataLoading();
  };
  const [{ user }] = useRecoilState(userAuthState);

  interface csCallInterface {
    agents_id: number;
    queues_id: number;
    call_type: number;
    cid: string;
    peer: number | null;
    ans: string;
    ivr: string;
    call_result: string;
    unique_no: string | null;
    ling_sec: number;
    call_sec: number;
    trans_yn: string;
    pickup_yn: string | null;
    record_file: string | null;
    callee_hangup_yn: string | null;
    start_date: string;
    ans_date: string | null;
    wait_date: string | null;
    ring_date: string | null;
    end_date: string;
  }

  const [initData, setInitData] = useState<csCallInterface | null>(null);

  const dataLoading = async () => {
    setLoading(true);
    let param = `?page=${queryState.page}`;
    if (queryState.searchVal.length > 0) {
      param += `&cid=${queryState.searchVal}`;
    }
    if (queryState.startDate.length > 0) {
      param +=
        '&start_date=' + encodeURIComponent(queryState.startDate + ' 00:00:00');
    }
    if (queryState.endDate.length > 0) {
      param +=
        '&end_date=' + encodeURIComponent(queryState.endDate + ' 23:59:59');
    }
    await axios
      // .get(`https://211.253.36.82:8100/api/v1/cdrs${param}`)
      .get(`https://ktapi-evnu.oilbank.co.kr:8100/api/v1/cdrs${param}`)
      .then((result: any) => {
        setInitData(result?.data?.item);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  useEffect(() => {
    void dataLoading();
  }, []);

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'desc',
    });
    void dataLoading();
  };

  const validateFromEndDate = () => {
    if (queryState?.startDate !== '' && queryState?.endDate !== '') {
      const from = new Date(queryState?.startDate);
      const end = new Date(queryState?.endDate);
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });
        setQueryState({
          ...queryState,
          startDate: '',
          endDate: '',
        });
      }
    }
  };

  useEffect(() => {
    validateFromEndDate();
  }, [queryState.startDate, queryState?.endDate]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search) {
      search();
    }
  };
  return (
    <>
      <DefaultDiv>
        {/* 조회 API 호출 */}
        <GridRefetch refetch={search} reload={reload} />
        <GridHeader container grid>
          <StyledSelectInput>
            <StyledSelect value="">
              <Select.Option value="">고객 전화번호</Select.Option>
            </StyledSelect>
            <Input
              value={queryState.searchVal}
              onChange={(event) => {
                setQueryState({
                  ...queryState,
                  searchVal: event.target.value,
                });
              }}
              onKeyDown={handleKeyPress}
            />
          </StyledSelectInput>
          <StyledInputDate iNumber={2} style={{ display: 'flex' }}>
            <label>접수 날짜</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={
                  queryState?.startDate ? dayjs(queryState?.startDate) : null
                }
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    startDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
            <ConfigProvider>
              <div>
                <DatePicker
                  format="YYYY-MM-DD"
                  picker="date"
                  placeholder="YYYY-MM-DD"
                  value={
                    queryState?.endDate ? dayjs(queryState?.endDate) : null
                  }
                  onChange={(value) => {
                    setQueryState({
                      ...queryState,
                      endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                    });
                  }}
                />
              </div>
            </ConfigProvider>
          </StyledInputDate>
        </GridHeader>
        <CSCallMainGridTable
          loading={loading}
          data={initData}
          state={state}
          setState={setState}
          queryState={queryState}
          setQueryState={setQueryState}
        />
      </DefaultDiv>
    </>
  );
};
export default CSCallMainGrid;
