import { useState, useEffect } from 'react';

// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 타입
import { type StateInterface, type TabIDInterface } from 'interfaces/ICommon';
// antd
import { Form, DatePicker, Select } from 'antd';
import { Input } from 'components/common/Input/Input';
// 스타일
import {
  GridContainer,
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';

import { ReservationGrid } from './ReservationGrid';
import {
  StyledSelectInput,
  StyledSelect,
  StyledFormItem,
} from 'components/common/test/Styled.ant';
import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

export const Reservation = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };

  // api 호출 데이터 상태
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  interface PaymentHistory {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    memthod: string;
    qty: number;
    searchKey: any;
    searchVal: string;
    status: any;
    // division: '' | 'STORE' | 'EMPLOYMERCHAN';
    // member: '' | 'Y' | 'N';
    // reservation: '' | 'Y' | 'N';
    // vehicle: '' | 'Y' | 'N';
    // payType: '' | 'pre' | 'partial';
  }
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    status: '',
    // division: '',
    // member: '',
    // reservation: '',
    // vehicle: '',
    // payType: '',
  });

  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'select',
      label: '구분',
      value: queryState.status,
      onChange(e: any) {
        handleQueryChange('status', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '예약완료',
          value: 'reserved',
        },

        {
          label: '충전준비',
          value: 'selected',
        },
        {
          label: '충전중',
          value: 'charging',
        },
        {
          label: '충전완료',
          value: 'completed',
        },
        {
          label: '충전취소',
          value: 'cancelled',
        },
        // {
        //   label: '이 종료되었습니다',
        //   value: 'terminated',
        // },
        {
          label: '충전대기',
          value: 'active',
        },
      ],
    },
    // {
    //   type: 'radio',
    //   label: '구분',
    //   value: queryState.division,
    //   onChange(e: any) {
    //     handleQueryChange('division', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '직영점',
    //       value: 'STORE',
    //     },
    //     {
    //       label: '자영/가맹점',
    //       value: 'EMPLOYMERCHAN',
    //     },
    //   ],
    // },
    // {
    //   type: 'radio',
    //   label: '사용자분류',
    //   value: queryState.member,
    //   onChange(e: any) {
    //     handleQueryChange('member', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '회원',
    //       value: 'Y',
    //     },
    //     {
    //       label: '비회원',
    //       value: 'N',
    //     },
    //   ],
    // },
    // {
    //   type: 'radio',
    //   label: '충전예약',
    //   value: queryState.reservation,
    //   onChange(e: any) {
    //     handleQueryChange('reservation', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '예약',
    //       value: 'Y',
    //     },
    //     {
    //       label: '비예약',
    //       value: 'N',
    //     },
    //   ],
    // },
    // {
    //   type: 'radio',
    //   label: '미출차',
    //   value: queryState.vehicle,
    //   onChange(e: any) {
    //     handleQueryChange('vehicle', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '이동',
    //       value: 'Y',
    //     },
    //     {
    //       label: '미이동',
    //       value: 'N',
    //     },
    //   ],
    // },
    // {
    //   type: 'input',
    //   label: '충전소 ID',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '충전소명',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '충전기 ID',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '차량번호',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'select',
    //   label: '예약 현황',
    //   onChange(e: any) {},
    //   listData: [
    //     {
    //       value: '',
    //       label: '전체',
    //     },
    //     {
    //       value: '이용가능',
    //       label: '이용가능',
    //     },
    //     {
    //       value: '예약완료',
    //       label: '예약완료',
    //     },
    //     {
    //       value: '예약취소',
    //       label: '예약취소',
    //     },
    //   ],
    // },
  ];

  const { loading, error, data, totalCount, refetch }: UseGetListResponse<any> =
    useGetListWt({
      url: `/v1/booking?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&status=${queryState.status}`,
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
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50, // 1page data 조회 갯수
      page: 0, // rpp에 따른 조회 페이지 번호
      odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    });
    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      // memthod: '',
      // qty: 0,
      searchKey: '',
      searchVal: '',
      status: '',
    });
    refetch();
  };
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
              <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
              <Select.Option value="chgs_name">충전소명</Select.Option>
              <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
              <Select.Option value="accountId">유저 ID</Select.Option>
              <Select.Option value="name">이름</Select.Option>
              <Select.Option value="phoneNo">전화번호</Select.Option>
            </StyledSelect>
            <Input
              value={queryState.searchVal}
              onChange={(event) => {
                setQueryState({
                  ...queryState,
                  searchVal: event.target.value,
                });
              }}
            />
          </StyledSelectInput>
          {gridHeaderData.map((item, index) => {
            return (
              <GridHeaderItem
                key={index}
                type={item.type}
                label={item.label}
                value={item.value}
                onChange={item.onChange}
                placeholder={item?.placeholder}
                listData={item?.listData}
              />
            );
          })}
          {/* <StyledFormItem name="status" label="예약 현황">
            <StyledSelect
              value={queryState.status}
              onChange={(value) => {
                // console.log(value);
                setQueryState({
                  ...queryState,
                  status: value,
                });
              }}
            >
              <Select.Option value="">전체</Select.Option>
              <Select.Option value="reserved">예약완료</Select.Option>
              <Select.Option value="selected">충전준비</Select.Option>
              <Select.Option value="charging">충전중</Select.Option>
              <Select.Option value="completed">충전완료</Select.Option>
              <Select.Option value="cancelled">충전취소</Select.Option>
              <Select.Option value="terminated">충전취소</Select.Option>
              <Select.Option value="active">충전대기</Select.Option>
            </StyledSelect>
          </StyledFormItem> */}

          {/* <StyledSelectInput>
            <Select
              label="예약 현황"
              options={[
                { label: '전체', value: '' },
                { label: '이용가능', value: '이용가능' },
                { label: '예약완료', value: '예약완료' },
                { label: '예약취소', value: '예약취소' },
              ]}
              onChange={(value) => {}}
            />
          </StyledSelectInput> */}

          {/* <StyledInputDate>
            <label>예약일자</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </StyledInputDate>
          <br />
          <Input label="예약 시작 시간" />
          <Input label="예약 완료 시간" /> */}
        </GridHeader>
        <GridContainer height="calc(100vh - 15.7rem)">
          <ReservationGrid
            data={data}
            state={state}
            loading={loading}
            setState={setState}
            totalCount={totalCount}
            setQueryState={setQueryState}
            queryState={queryState}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
