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
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const ContractorGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  typeUser,
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
  ];
  typeUser === 'HDO' &&
    gridHeaderData.push({
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
          label: 'CS',
          value: 'CS',
        },
        {
          label: 'A/S',
          value: 'AS',
        },
        {
          label: '기타',
          value: 'ETC',
        },
        // {
        //   label: '파킹스루',
        //   value: 'RF_CARD',
        // },
      ],
    });

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
            <Select.Option value="contactPhoneNo">전화</Select.Option>
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

export default ContractorGridHeader;
