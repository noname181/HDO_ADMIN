// import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
// import { Select } from 'components/common/Select/Select';

import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setCheckRowId: any;
}
const MessageLogGridHeader = ({
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
      type: 'radio',
      label: '전송결과',
      value: queryState.returnType,
      onChange(e: any) {
        handleQueryChange('returnType', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '성공',
          value: 'S',
        },
        {
          label: '실패',
          value: 'F',
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
          label: 'CS',
          value: 'CS',
        },
        {
          label: '시스템',
          value: 'SYSTEM',
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
        {/* {gridHeaderData.map((item, index) => {
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
          })} */}
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
            <Select.Option value="phoneNo">수신번호</Select.Option>
            <Select.Option value="nameId">발신자</Select.Option>
            <Select.Option value="TEXT_MESSAGE">내용</Select.Option>
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
        {/* <StyledInputDate iNumber={2}>
          <label>등록일</label>
          <div>
            <DatePicker
              format="YYYY-MM-DD"
              picker="date"
              placeholder="YYYY-MM-DD"
              value={
                queryState?.startDateCreate
                  ? dayjs(queryState?.startDateCreate)
                  : null
              }
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  startDateCreate: value
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
                queryState?.endDateCreate
                  ? dayjs(queryState?.endDateCreate)
                  : null
              }
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  endDateCreate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                });
              }}
            />
          </div>
        </StyledInputDate> */}
        <StyledInputDate iNumber={2}>
          <label>전송일</label>
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
        {gridHeaderData?.map((item, index) => {
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

export default MessageLogGridHeader;
