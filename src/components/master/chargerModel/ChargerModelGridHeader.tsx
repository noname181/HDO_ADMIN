import { type QueryStateInterface } from 'interfaces/ICharger';
import { ConTypeSelectList, SpeedTypeSelectList } from 'utils/codelookup';
import {
  DefaultDiv,
  GridHeader,
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
// import { useRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';
// import { useEffect } from 'react';

const ChargerModelGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: QueryStateInterface<any>) => {
  // const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // const handleQueryChange = (field: string, value: any) => {
  //   setQueryState({
  //     ...queryState,
  //     [field]: value,
  //   });
  // };

  // const gridHeaderData: GridHeaderItemProps[] = [
  //   {
  //     type: 'select',
  //     label: '제조사',
  //     value: queryState.manufacturerId,
  //     onChange(e: any) {
  //       handleQueryChange('manufacturerId', e);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: '클린일렉스',
  //         value: '1',
  //       },
  //       {
  //         label: '삼성전자',
  //         value: '2',
  //       },
  //     ],
  //   },
  //   {
  //     type: 'input',
  //     label: '모델명',
  //     value: queryState.modelName,
  //     placeholder: '모델명을 입력해주세요',
  //     onChange(e: any) {
  //       handleQueryChange('modelName', e.target.value);
  //     },
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
        <StyledSelectInput>
          {/* <Select
            // label=""
            options={[
              { label: '전체', value: '' },
              { label: '제조사', value: '제조사' },
              { label: '모델 ID', value: '모델 ID' },
              { label: '모델명', value: '모델명' },
              { label: '커넥터 타입', value: '커넥터 타입' },
              { label: '충전유형', value: '충전유형' },
              { label: '충전속도', value: '충전속도' },
              { label: '채널수', value: '채널수' },
            ]}
            onChange={(value) => {}}
          /> */}
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
            <Select.Option value="MANUFACTURERNAME">제조사</Select.Option>
            <Select.Option value="MODELCODE">모델 ID</Select.Option>
            <Select.Option value="MODELNAME">모델명</Select.Option>
            {/* <Select.Option value="CONNECTORTYPE">커넥터 타입</Select.Option>
            <Select.Option value="SPEEDTYPE">충전유형</Select.Option> */}
            <Select.Option value="MAXKW">충전속도</Select.Option>
            <Select.Option value="CHANNELCOUNT">채널수</Select.Option>
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
        <ConTypeSelectList
          value={queryState.contype}
          onChange={(e: any) => {
            setQueryState({
              ...queryState,
              contype: e,
            });
          }}
        />
        <SpeedTypeSelectList
          value={queryState.speedtype}
          onChange={(e: any) => {
            setQueryState({
              ...queryState,
              speedtype: e,
            });
          }}
        />
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
      </GridHeader>
    </DefaultDiv>
  );
};

export default ChargerModelGridHeader;
