import { type QueryStateInterface } from 'interfaces/ICharger';
import { useEffect } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
const SettlementGridHeader = ({
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
    // {
    //   type: 'radio',
    //   label: '구분',
    //   value: queryState.class,
    //   onChange(e: any) {
    //     handleQueryChange('class', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '직영점',
    //       value: 'aa',
    //     },
    //     {
    //       label: '자영/가맹점',
    //       value: 'bb',
    //     },
    //   ],
    // },
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
          label: 'EV',
          value: 'EV',
        },
        {
          label: '직영점',
          value: '직영점',
        },
      ],
    },
    {
      type: 'radio',
      label: '지불방법',
      value: queryState.paymentMethod,
      onChange(e: any) {
        handleQueryChange('paymentMethod', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '카드',
          value: 'false',
        },
      ],
    },
  ];
  // function reloadData() {
  //   setQueryState({
  //     ...queryState,
  //     content: '',
  //   });
  //   if (refetch) {
  //     refetch();
  //   }
  // }

  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        {/* <StyledSelectInput>
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
            <Select.Option value="aa">날짜별</Select.Option>
            <Select.Option value="bb">충전소 구분별</Select.Option>
            <Select.Option value="cc">지불방법별 검색</Select.Option>
          </StyledSelect>
          <Input
            value={queryState.searchVal}
            onChange={(event) => {
              setQueryState({
                ...queryState,
                searchVal: event.target.value,
              });
            }}
          />
        </StyledSelectInput> */}
        <StyledInputDate iNumber={2}>
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
        </StyledInputDate>
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

export default SettlementGridHeader;
