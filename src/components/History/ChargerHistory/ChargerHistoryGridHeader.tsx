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
import {
  StyledInputDate,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { Input } from 'components/common/Input/Input';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}

const ChargerHistoryGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  setAreaNo,
  areaNo,
}: Props<any>) => {
  // const [areaNo, setAreaNo] = useState('');
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '사용자분류',
      value: queryState.isCredit,
      onChange(e: any) {
        handleQueryChange('isCredit', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '회원',
          value: 'N',
        },
        {
          label: '비회원',
          value: 'Y',
        },
      ],
    },
    {
      type: 'radio',
      label: '구분',
      value: queryState.division,
      onChange(e: any) {
        handleQueryChange('division', e.target.value);
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
      type: 'select',
      label: '결제상태',
      value: queryState?.payCompletedYN,
      onChange(e: any) {
        handleQueryChange('payCompletedYN', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '결제',
          value: 'Y',
        },
        {
          label: '미결제',
          value: 'N',
        },
        {
          label: '환불/취소',
          value: 'NO',
        },
        {
          label: '취소실패',
          value: 'FAIL',
        },
      ],
    },
    {
      type: 'select',
      label: '지역',
      value: queryState.region,
      onChange(value: any) {
        handleQueryChange('region', value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '서울',
          value: '서울',
        },
        {
          label: '경기도',
          value: '경기도',
        },
        {
          label: '인천',
          value: '인천',
        },
        {
          label: '강원',
          value: '강원',
        },
        {
          label: '충북',
          value: '충북',
        },
        {
          label: '세종',
          value: '세종',
        },
        {
          label: '대전',
          value: '대전',
        },
        {
          label: '충남',
          value: '충남',
        },
        {
          label: '전북',
          value: '전북',
        },
        {
          label: '광주',
          value: '광주',
        },
        {
          label: '전남',
          value: '전남',
        },
        {
          label: '경북',
          value: '경북',
        },
        {
          label: '대구',
          value: '대구',
        },
        {
          label: '울산',
          value: '울산',
        },
        {
          label: '경남',
          value: '경남',
        },
        {
          label: '부산',
          value: '부산',
        },
        {
          label: '제주',
          value: '제주',
        },
      ],
    },
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
                searchKey: value as string,
              });
            }}
          >
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="member_name">회원 명</Select.Option>
            <Select.Option value="member_id">회원 ID</Select.Option>
            <Select.Option value="cl_no">Cl-no</Select.Option>
            <Select.Option value="chgs_name">충전소명</Select.Option>
            <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
            <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
            <Select.Option value="receivePhoneNo">전화번호</Select.Option>
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
          <label>충전일</label>
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
        <StyledInputDate iNumber={2}>
          <label>결제일</label>
          <div>
            <DatePicker
              format="YYYY-MM-DD"
              picker="date"
              placeholder="YYYY-MM-DD"
              value={
                queryState?.startPaymentDate
                  ? dayjs(queryState?.startPaymentDate)
                  : null
              }
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  startPaymentDate: value
                    ? dayjs(value).format('YYYY-MM-DD')
                    : '',
                });
              }}
            />
          </div>
          <div>
            <DatePicker
              format="YYYY-MM-DD"
              picker="date"
              placeholder="YYYY-MM-DD"
              value={
                queryState?.endPaymentDate
                  ? dayjs(queryState?.endPaymentDate)
                  : null
              }
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  endPaymentDate: value
                    ? dayjs(value).format('YYYY-MM-DD')
                    : '',
                });
              }}
            />
          </div>
        </StyledInputDate>

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
export default ChargerHistoryGridHeader;
