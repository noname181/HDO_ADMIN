import { useEffect, useState } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { Button } from 'components/common/Button/Button';
import { Select } from 'antd';
import { Input } from 'components/common/Input/Input';
import {
  StyledFormItem,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { FileSelectList, ChargerListSelectList } from 'utils/filetocharger';

export const TermsGridHeader = ({
  queryState,
  setQueryState,
  sendContents,
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
      label: '약관 전송상태',
      value: queryState.update,
      onChange(e: any) {
        handleQueryChange('update', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '전송완료',
          value: 'done',
        },
        {
          label: '미전송',
          value: 'need',
        },
      ],
    },
    {
      type: 'radio',
      label: '구분',
      value: queryState.org,
      onChange(e: any) {
        handleQueryChange('org', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '직영점',
          value: 'STT_DIR',
        },
        {
          label: '자영점',
          value: 'STT_FRN',
        },
        {
          label: 'EV사업팀',
          value: 'EV_DIV',
        },
      ],
    },
    // {
    //   type: 'input',
    //   label: '유저 Id',
    //   value: queryState.user_id,
    //   onChange(e: any) {
    //     handleQueryChange('user_id', e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   value: queryState.user_name,
    //   onChange(e: any) {
    //     handleQueryChange('user_name', e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '전화번호',
    //   value: queryState.phone,
    //   onChange(e: any) {
    //     handleQueryChange('phone', e.target.value);
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
      <GridHeader container>
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
            <Select.Option value="chargingStation">충전소명</Select.Option>
            <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
            <Select.Option value="chargerModel">모델명</Select.Option>
            {/* <Select.Option value="accountId">유저 ID</Select.Option>
            <Select.Option value="user_name">이름</Select.Option>
            <Select.Option value="phone">전화번호</Select.Option> */}
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
        {/* <div style={{ display: 'flex', alignItems: 'center', width: '300px' }}>
          <p style={{ width: 120 }}>적용 버전</p>
          
          <ChargerListSelectList
            value={queryState.clause_version}
            onChange={(e: any) => {
              setQueryState({
                ...queryState,
                clause_version: e,
              });
            }}
          />
        </div> */}
        <div style={{ width: '90px', marginLeft: 'auto', marginRight: '10px' }}>
          <Button size="md" color="primary" w100={true} onClick={sendContents}>
            약관 전송
          </Button>
        </div>
      </GridHeader>
    </DefaultDiv>
  );
};
