import { useEffect, useState } from 'react';

import { AreaSelectList, BranchSelectList } from 'utils/codelookup';

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
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const TroubleReportGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: QueryStateInterface<any>) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '상태',
      value: queryState.status,
      onChange(e: any) {
        handleQueryChange('status', e.target.value);
        // setStatusReport(e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '신고',
          value: 'REPORTED',
        },
        {
          label: '접수',
          value: 'ACCEPTED',
        },
        {
          label: '처리중',
          value: 'INPROGRESS',
        },
        {
          label: '완료',
          value: 'COMPLETED',
        },
      ],
    },
    // {
    //   type: 'input',
    //   label: '충전소명',
    //   placeholder: '충전소명을 입력해주세요',
    //   onChange(e: any) {
    //     handleQueryChange('ChargingStationName', e.target.value);
    //     setchgsName(e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '담당자명',
    //   placeholder: '신고자명을 입력해주세요',
    //   onChange(e: any) {
    //     handleQueryChange('reporterName', e.target.value);
    //     setSearchReportTer(e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '충전소 ID',
    //   onChange(e: any) {
    //     handleQueryChange('chargeStationID', e.target.value);
    //     setchargeStationID(e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   value: queryState.name,
    //   onChange(e: any) {
    //     handleQueryChange('name', e.target.value);
    //     setUserName(e.target.value);
    //   },
    // },
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
            <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
            <Select.Option value="chgs_name">충전소명</Select.Option>
            <Select.Option value="chgs_address">주소</Select.Option>
            <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
            <Select.Option value="chgs_operator_manager">
              현장담당자
            </Select.Option>
            <Select.Option value="accountId">유저 ID</Select.Option>
            <Select.Option value="userName">이름</Select.Option>
            <Select.Option value="userPhone">전화번호</Select.Option>
            <Select.Option value="modelName">모댈명</Select.Option>
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
