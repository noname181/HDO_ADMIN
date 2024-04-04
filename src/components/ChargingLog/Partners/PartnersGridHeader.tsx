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
const PartnersGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  setCheckRowId,
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
      label: '액션',
      value: queryState.division,
      onChange(e: any) {
        handleQueryChange('division', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '로그인',
          value: 'SUCCESS',
        },
        {
          label: '로그아웃',
          value: 'LOGOUT',
        },
        {
          label: '등록',
          value: 'CREATE',
        },
        {
          label: '수정',
          value: 'UPDATE',
        },
        {
          label: '삭제',
          value: 'DELETE',
        },
        {
          label: '조회',
          value: 'INFO',
        },
        {
          label: '다운로드',
          value: 'EXCEL_DOWNLOAD',
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
            <Select2.Option value="all">전체</Select2.Option>
            <Select2.Option value="id">회원 ID</Select2.Option>
            <Select2.Option value="name">회원 명</Select2.Option>
            {/* <Select2.Option value="ip">Ip</Select2.Option> */}
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

export default PartnersGridHeader;
