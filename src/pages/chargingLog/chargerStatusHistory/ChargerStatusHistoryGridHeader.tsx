// import { type QueryStateInterface } from 'interfaces/ICharger';
import { type Dispatch, type SetStateAction } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select as Select2 } from 'antd';
import dayjs from 'dayjs';

interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setCheckRowId: any;
}
const ChargerStatusHistoryGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  setCheckRowId,
  reload,
}: QueryStateInterface<any>) => {
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'select',
      label: '상태',
      value: queryState?.status,
      onChange(e: any) {
        // console.log(e);
        handleQueryChange('status', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '온라인',
          value: '온라인',
        },
        {
          label: '오프라인',
          value: '오프라인',
        },
        {
          label: '충전시작',
          value: '충전시작',
        },
        {
          label: '충전종료',
          value: '충전종료',
        },
        {
          label: '충전기 비상정지 복귀',
          value: '비상정지복귀',
        },
        {
          label: '충전기 비상정지',
          value: '비상정지',
        },
        {
          label: '점검종료',
          value: '점검종료',
        },
        {
          label: '점검중',
          value: '점검중',
        },
        {
          label: '충전기 에러',
          value: '충전기에러',
        },
        {
          label: '예약 시작',
          value: '예약시작',
        },
        {
          label: '예약 종료',
          value: '예약종료',
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
                searchKey: value,
              });
            }}
          >
            <Select2.Option value="">전체</Select2.Option>
            <Select2.Option value="chgs_name">충전소명</Select2.Option>
            <Select2.Option value="chgs_station_id">충전소 ID</Select2.Option>
            <Select2.Option value="chg_charger_id">충전기 ID</Select2.Option>
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
          <label>기간</label>
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

export default ChargerStatusHistoryGridHeader;
