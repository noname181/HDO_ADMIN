import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';
import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const HDOAdminGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: any) => {
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '이용유무',
      value: queryState.status,
      onChange(e: any) {
        handleQueryChange('status', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '이용',
          value: 'ACTIVE',
        },
        {
          label: '중지',
          value: 'BLOCK',
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
            <Select.Option value="ALL">전체</Select.Option>
            <Select.Option value="NAME">이름</Select.Option>
            <Select.Option value="DEPT">부서</Select.Option>
            <Select.Option value="ACCOUNTID">사번</Select.Option>
            <Select.Option value="PHONE">전화번호</Select.Option>
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

export default HDOAdminGridHeader;
