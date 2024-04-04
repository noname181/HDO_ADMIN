import { type QueryStateInterface } from 'interfaces/ICharger';
import { useEffect, useRef, useState } from 'react';
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
import locale from 'antd/es/date-picker/locale/ko_KR';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const MonthlySettlementGridHeader = ({
  queryState,
  setQueryState,
  refetch,
}: QueryStateInterface<any>) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const [areaNo, setAreaNo] = useState('');

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '구분',
      value: queryState.class,
      onChange(e: any) {
        handleQueryChange('class', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: 'EV',
          value: 'aa',
        },
        {
          label: '직영점',
          value: 'bb',
        },
      ],
    },
    {
      type: 'radio',
      label: '전체',
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
          label: '회원',
          value: 'cc',
        },
        {
          label: '비회원',
          value: 'dd',
        },
      ],
    },
  ];
  function reloadData() {
    setQueryState({
      ...queryState,
      content: '',
      month: '',
    });
    if (refetch) {
      refetch();
    }
  }

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter' && refetch) {
  //     refetch();
  //   }
  // };

  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reloadData} />
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
            <Select.Option value="aa">충전소명</Select.Option>
            <Select.Option value="bb">충전소 ID</Select.Option>
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
        {/* <AreaSelectList
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
        /> */}
        <StyledInputDate iNumber={2}>
          <label>날짜</label>
          <div>
            <DatePicker
              format="YYYY-MM"
              picker="month"
              placeholder="YYYY-MM"
              // locale={locale}
              value={queryState?.month ? dayjs(queryState?.month) : null}
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  month: value ? dayjs(value).format('YYYY-MM') : '',
                });
              }}
            />
          </div>
          <div></div>
          {/* <div>
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
          </div> */}
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

export default MonthlySettlementGridHeader;
