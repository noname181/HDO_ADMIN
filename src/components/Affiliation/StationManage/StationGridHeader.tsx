import { type QueryStateInterface } from 'interfaces/ICharger';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { Input } from 'components/common/Input/Input';
import {
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';
interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}
const StationGridHeader = ({
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
  };

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '운영',
      value: queryState.closed,
      onChange(e: any) {
        handleQueryChange('closed', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '운영',
          value: 'false',
        },
        {
          label: '정지',
          value: 'true',
        },
      ],
    },
    {
      type: 'radio',
      label: '구분',
      value: queryState.cate,
      onChange(e: any) {
        handleQueryChange('cate', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '직영점',
          value: 'X1',
        },
        {
          label: '자영점',
          value: 'A1',
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
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="fullname">사업장명</Select.Option>
            <Select.Option value="contactName">대표자</Select.Option>
            <Select.Option value="address">주소</Select.Option>
            <Select.Option value="STN_CUST_NO">사업장 고객번호</Select.Option>
            <Select.Option value="name">약칭</Select.Option>
            <Select.Option value="contactPhoneNo">연락처</Select.Option>
            <Select.Option value="bizRegNo">사업자번호</Select.Option>
            <Select.Option value="contactEmail">이메일</Select.Option>
            <Select.Option value="STN_STN_ID">사업장 ID</Select.Option>
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
          areaNo={areaNo}
          onChange={(e: any) => {
            setQueryState({
              ...queryState,
              branch: e,
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
      </GridHeader>
    </DefaultDiv>
  );
};

export default StationGridHeader;
