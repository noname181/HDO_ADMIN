import { useState, useEffect } from 'react';
import { UpdateStateInterface, type StateInterface } from 'interfaces/ICommon';
import { DefaultDiv, GridHeader, GridRefetch } from 'styles/style';
import OutstandingPaymentGridTable from './OutstandingPaymentGridTable';
import { DatePicker, Select } from 'antd';
import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import dayjs from 'dayjs';
import { useGetListWt } from 'hooks/useGetListWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type UseGetListResponse } from 'interfaces/IUseGetData';

const OutstandingPaymentGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // api 호출 데이터 상태
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  interface PaymentHistory {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: string;
    searchVal: string;
    startDate: string;
    endDate: string;
  }
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayYear = String(yesterdayDate.getFullYear());
  const yesterdayMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yesterdayNumber = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayNumber}`;
  const [queryState, setQueryState] = useState<PaymentHistory>({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    startDate: yesterday,
    endDate: today,
  });

  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    totalClKwh,
    totalNotPaid,
    totalCost,
  }: UseGetListResponse<any> = useGetListWt({
    url:
      `v1/payment/outstanding?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
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
    // console.log('refetch');
    // console.log(queryState.page);
  }, [state, queryState]);

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      startDate: yesterday,
      endDate: today,
    });
    refetch();
  };
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    refetch();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  const validateFromEndDate = (type: string) => {
    const from = new Date(queryState?.startDate);
    const end = new Date(queryState?.endDate);
    // console.log(now);
    // console.log(from);
    // console.log(end);
    // Compare the two dates
    if (queryState?.startDate !== '' && queryState?.endDate !== '') {
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });
        if (type === 'start') {
          setQueryState({
            ...queryState,
            startDate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            endDate: '',
          });
        }
      }
    }
    // Compare the selected date with today
    if (queryState?.startDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startDate: today,
      });
    }
    if (queryState?.endDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endDate: today,
      });
    }
  };
  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState.endDate]);

  return (
    <>
      <DefaultDiv>
        <GridRefetch refetch={search} reload={reload} />
        <GridHeader container grid>
          <StyledSelectInput>
            <StyledSelect
              value={queryState.searchKey}
              onChange={(value) => {
                // console.log(value);
                setQueryState({
                  ...queryState,
                  searchKey: value as string,
                });
              }}
            >
              <Select.Option value="">전체</Select.Option>
              <Select.Option value="user_name">회원 명</Select.Option>
              <Select.Option value="accountId">회원 ID</Select.Option>
              <Select.Option value="receivePhoneNo">전화번호</Select.Option>
              <Select.Option value="chgs_name">충전소명</Select.Option>
              <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
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
          <StyledInputDate iNumber={2}>
            <label>충전일자</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={
                  queryState?.startDate ? dayjs(queryState?.startDate) : null
                }
                onChange={(value) => {
                  // console.log(dayjs(value).format('YYYY-MM-DD'));
                  setQueryState({
                    ...queryState,
                    startDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={queryState?.endDate ? dayjs(queryState?.endDate) : null}
                onChange={(value) => {
                  // console.log(dayjs(value).format('YYYY-MM-DD'));
                  setQueryState({
                    ...queryState,
                    endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
          </StyledInputDate>
        </GridHeader>
        <OutstandingPaymentGridTable
          queryState={queryState}
          setQueryState={setQueryState}
          loading={loading}
          data={data}
          state={state}
          setState={setState}
          totalCount={totalCount}
          totalClKwh={totalClKwh}
          totalNotPaid={totalNotPaid}
          totalCost={totalCost}
        />
      </DefaultDiv>
    </>
  );
};
export default OutstandingPaymentGrid;
