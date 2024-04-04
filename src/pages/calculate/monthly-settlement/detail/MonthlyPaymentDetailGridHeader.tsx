import { type QueryStateInterface } from 'interfaces/ICharger';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import {
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';
import { Input } from 'components/common/Input/Input';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}
const MonthlyPaymentDetailGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  setAreaNo,
  areaNo,
}: Props<any>) => {
  // const handleQueryChange = (field: string, value: any) => {
  //   setQueryState({
  //     ...queryState,
  //     [field]: value,
  //   });
  // };
  // const gridHeaderData: GridHeaderItemProps[] = [
  //   {
  //     type: 'radio',
  //     label: '구분',
  //     value: queryState.division,
  //     onChange(e: any) {
  //       handleQueryChange('division', e.target.value);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: '직영점',
  //         value: 'STORE',
  //       },
  //       {
  //         label: '자영/가맹점',
  //         value: 'EMPLOYMERCHAN',
  //       },
  //     ],
  //   },
  // ];

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
        <AreaSelectList
          value={queryState.area}
          location={'/monthly-settlement'}
          onChange={(e: any) => {
            setAreaNo(e);
            setQueryState({
              ...queryState,
              area: e,
              branch: '',
            });
          }}
        />
        <BranchSelectList
          value={queryState.branch}
          location={'/monthly-settlement'}
          areaNo={areaNo}
          onChange={(e: any) => {
            setQueryState({
              ...queryState,
              branch: e,
            });
          }}
        />
        {/* <StyledInputDate iNumber={2}>
          <label>날짜</label>
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
        </StyledInputDate> */}
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
      </GridHeader>
    </DefaultDiv>
  );
};

export default MonthlyPaymentDetailGridHeader;
