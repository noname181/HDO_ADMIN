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
import { Input } from 'components/common/Input/Input';
import dayjs from 'dayjs';
import { DRow } from 'pages/cs/CSHome/style';
import { Button } from 'components/common/Button/Button';
interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}
const PaymentDetailsGridHeader = ({
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

    {
      type: 'radio',
      label: '인증방법',
      value: queryState.payType,
      onChange(e: any) {
        handleQueryChange('payType', e.target.value);
      },
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
  ];
  const gridHeaderData2: GridHeaderItemProps[] = [
    // {
    //   type: 'input',
    //   label: '속도',
    //   value: queryState.speed,
    //   onChange(e: any) {
    //     handleQueryChange('speed', e.target.value);
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
            <Select.Option value="address">주소</Select.Option>
            <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
            <Select.Option value="manager">현장담당자</Select.Option>
            <Select.Option value="accountId">유저 ID</Select.Option>
            <Select.Option value="user_name">이름</Select.Option>
            <Select.Option value="receivePhoneNo">전화번호</Select.Option>
            <Select.Option value="modelName">모델 명</Select.Option>
            <Select.Option value="card_no">카드번호</Select.Option>
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
          <label>로그 발생일자</label>
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
        {/* <DRow style={{ justifyContent: 'flex-end' }}>
          <Button onClick={refetch} minWidth="100px">
            검색
          </Button>
        </DRow> */}
      </GridHeader>
    </DefaultDiv>
  );
};
export default PaymentDetailsGridHeader;
