// import { type QueryStateInterface } from 'interfaces/ICharger';
import { type Dispatch, type SetStateAction } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';

import {
  StyledInputDate,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { DatePicker, Input, Select as Select2 } from 'antd';
import dayjs from 'dayjs';
interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
}
const PaymentLogGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: QueryStateInterface<any>) => {
  // const handleQueryChange = (field: string, value: any) => {
  //   setQueryState({
  //     ...queryState,
  //     [field]: value,
  //   });
  // };
  // const gridHeaderData: GridHeaderItemProps[] = [
  //   {
  //     type: 'select',
  //     label: '액션',
  //     value: queryState.division,
  //     onChange(e: any) {
  //       handleQueryChange('division', e);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: '로그인',
  //         value: 'SUCCESS',
  //       },
  //       {
  //         label: '로그아웃',
  //         value: 'LOGOUT',
  //       },
  //       {
  //         label: '등록',
  //         value: 'CREATE',
  //       },
  //       {
  //         label: '수정',
  //         value: 'UPDATE',
  //       },
  //       {
  //         label: '삭제',
  //         value: 'DELETE',
  //       },
  //       {
  //         label: '조회',
  //         value: 'INFO',
  //       },
  //       {
  //         label: '다운로드',
  //         value: 'EXCEL_DOWNLOAD',
  //       },
  //     ],
  //   },
  // ];

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter' && refetch) {
  //     refetch();
  //   }
  // };
  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        {/* <StyledSelectInput>
          <StyledSelect
            value={queryState.searchKey}
            onChange={(value) => {
              setQueryState({
                ...queryState,
                searchKey: value,
              });
            }}
          >
            <Select2.Option value="">전체</Select2.Option>
            <Select2.Option value="accountId">회원</Select2.Option>
            <Select2.Option value="name">이름</Select2.Option>
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
        </StyledSelectInput> */}
        <StyledInputDate iNumber={2}>
          <label>배치 일</label>
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
    </DefaultDiv>
  );
};

export default PaymentLogGridHeader;
