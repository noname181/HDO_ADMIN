import { useState, type Dispatch, type SetStateAction } from 'react';
import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
// import { Select } from 'components/common/Select/Select';
import { DatePicker, Select } from 'antd';
import {
  StyledSelectInput,
  StyledSelect,
  StyledInputDate,
} from 'components/common/test/Styled.ant';
import dayjs from 'dayjs';
import { Input } from 'components/common/Input/Input';
interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}
const PaymentHistoryGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  setAreaNo,
  areaNo,
}: Props<any>) => {
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
    // console.log(queryState);
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '구분',
      value: queryState.category,
      onChange(e: any) {
        handleQueryChange('category', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '직영점',
          value: 'STT_DIR',
        },
        {
          label: '자영점',
          value: 'STT_FRN',
        },
        {
          label: 'EV사업팀',
          value: 'EV_DIV',
        },
      ],
    },
    {
      type: 'radio',
      label: '사용자분류',
      value: queryState.member,
      onChange(e: any) {
        handleQueryChange('member', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '회원',
          value: 'Y',
        },
        {
          label: '비회원',
          value: 'N',
        },
      ],
    },
    // {
    //   type: 'radio',
    //   label: '미출차',
    //   value: queryState.vehicle,
    //   // onChange(e: any) {
    //   //   handleQueryChange('vehicle', e.target.value);
    //   // },
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
    {
      type: 'radio',
      label: '인증방법',
      value: queryState.payType,
      // onChange(e: any) {
      //   handleQueryChange('payType', e.target.value);
      // },
      listData: [
        {
          label: '전체',
          value: '',
        },
        // {
        //   label: '카드',
        //   value: '카드',
        // },
        {
          label: 'PnC',
          value: 'pnc',
        },
        {
          label: 'QR',
          value: 'qr',
        },
        {
          label: '회원카드',
          value: '회원카드',
        },
      ],
    },

    // {
    //   type: 'radio',
    //   label: '결제방법',
    //   value: queryState.payType,
    //   onChange(e: any) {
    //     handleQueryChange('payType', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '인증방법',
    //       value: '',
    //     },
    //     {
    //       label: '카드',
    //       value: '카드',
    //     },
    //     {
    //       label: 'PNC',
    //       value: 'pnc',
    //     },
    //     {
    //       label: 'QR',
    //       value: 'qr',
    //     },
    //     {
    //       label: 'NFC',
    //       value: 'nfc',
    //     },
    //   ],
    // },
  ];
  const gridHeaderData2: GridHeaderItemProps[] = [
    {
      type: 'input',
      label: '속도',
      value: queryState.speed,
      onChange(e: any) {
        handleQueryChange('speed', e.target.value);
      },
      // listData: [
      //   { value: '', label: '전체' },
      //   { value: '200', label: '200kWh' },
      //   { value: '100', label: '100kWh' },
      //   { value: '50', label: '50kWh' },
      //   { value: '7', label: '7kWh' },
      // ],
    },
    // {
    //   type: 'select',
    //   label: '인증방법',
    //   value: queryState.method,
    //   onChange(e: any) {
    //     handleQueryChange('method', e);
    //   },
    //   listData: [
    //     { value: '', label: '전체' },
    //     { value: 'CREDIT', label: 'CREDIT' },
    //     { value: 'RF', label: 'RF' },
    //     { value: 'NFC', label: 'NFC' },
    //     { value: 'APP', label: 'APP' },
    //     { value: 'PNC', label: 'PNC' },
    //   ],
    // },
    // {
    //   type: 'input',
    //   label: '유저 ID',
    //   value: queryState.user_id,
    //   onChange(e: any) {
    //     handleQueryChange('user_id', e.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   value: queryState.user_name,
    //   onChange(e: any) {
    //     handleQueryChange('user_name', e.value);
    //   },
    // },
  ];

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };

  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        <StyledSelectInput>
          {/* <Select
            // label=""
            options={[
              { label: '전체', value: '' },
              { label: '충전소 ID', value: 'chgs_station_id' },
              { label: '충전소명', value: 'chgs_name' },
              { label: '충전기 ID', value: 'chg_charger_id' },
              { label: '유저 ID', value: 'accountId' },
              { label: '이름', value: 'name' },
              { label: '전화번호', value: 'phoneNo' },
            ]}
            onChange={(event) => {
              setQueryState({
                ...queryState,
                searchKey: event.target.value,
              });
            }}
          /> */}
          <StyledSelect
            value={queryState.searchKey}
            onChange={(value) => {
              // console.log(value);
              setQueryState({
                ...queryState,
                searchKey: value,
              });
            }}
          >
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
            <Select.Option value="chgs_name">충전소명</Select.Option>
            <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
            <Select.Option value="accountId">유저 ID</Select.Option>
            <Select.Option value="user_name">이름</Select.Option>
            <Select.Option value="receivePhoneNo">전화번호</Select.Option>
            <Select.Option value="card_no">카드번호</Select.Option>
            <Select.Option value="appliedUnitPrice">적용단가</Select.Option>
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
          <label>결제일</label>
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
        <AreaSelectList
          value={queryState.area}
          onChange={(e: any) => {
            setAreaNo(e);
            setQueryState({
              ...queryState,
              area: e,
              branch: '',
              rpp: 50,
            });
          }}
        />
        <BranchSelectList
          value={queryState.branch}
          areaNo={areaNo}
          onChange={(e: any) => {
            setQueryState({
              ...queryState,
              branch: e,
              rpp: 50,
            });
          }}
        />
        {gridHeaderData2.map((item, index) => {
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
      </GridHeader>
    </DefaultDiv>
  );
};
export default PaymentHistoryGridHeader;
