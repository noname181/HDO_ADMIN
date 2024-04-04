import { type QueryStateInterface } from 'interfaces/ICharger';

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

const ClientGridHeader = ({
  queryState,
  setQueryState,
  refetch,
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
          label: '법인',
          value: 'BIZ',
        },
        {
          label: '제휴',
          value: 'ALLNC',
        },
        // {
        //   label: '그룹',
        //   value: 'GRP',
        // },
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
            <Select.Option value="name">소속명</Select.Option>
            <Select.Option value="contactName">대표자</Select.Option>
            <Select.Option value="contactPhoneNo">연락처</Select.Option>
            <Select.Option value="contactEmail">이메일</Select.Option>
            <Select.Option value="address">주소</Select.Option>
            <Select.Option value="bizRegNo">사업자번호</Select.Option>
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
          <label>생성일</label>
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
              value={queryState?.endDate ? dayjs(queryState?.endDate) : null}
              placeholder="YYYY-MM-DD"
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

export default ClientGridHeader;
