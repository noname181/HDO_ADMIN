import { type Dispatch, type SetStateAction } from 'react';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
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

interface Props<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setAreaNo: any;
  areaNo: any;
}
export const ChargerGridHeader = ({
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
    {
      type: 'radio',
      label: '충전기 사용',
      value: queryState?.chg_use_yn,
      onChange(e: any) {
        handleQueryChange('chg_use_yn', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '사용',
          value: 'Y',
        },
        {
          label: '미사용',
          value: 'N',
        },
      ],
    },
    {
      type: 'select',
      label: '충전상태',
      value: queryState?.cs_charging_state,
      onChange(e: any) {
        handleQueryChange('cs_charging_state', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '충전가능',
          value: 'available',
        },
        {
          label: '준비중',
          value: 'preparing',
        },
        {
          label: '충전중',
          value: 'charging',
        },
        {
          label: '종료중',
          value: 'finishing',
        },
        {
          label: '오프라인',
          value: 'offline',
        },
        {
          label: '비상정지',
          value: 'faulted',
        },
        {
          label: '예약중',
          value: 'reserved',
        },
        {
          label: '점검중',
          value: 'unavailable',
        },
        {
          label: '설치중',
          value: 'installing',
        },
      ],
    },
    {
      type: 'radio',
      label: '운영상태',
      value: queryState?.charger_status,
      onChange(e: any) {
        handleQueryChange('charger_status', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '정상',
          value: 'normal',
        },
        {
          label: '고장(점검중)',
          value: 'malfunction',
        },
      ],
    },
    // {
    //   type: 'radio',
    //   label: '고장여부',
    //   value: queryState.isJam,
    //   onChange(e: any) {
    //     handleQueryChange('isJam', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '정상',
    //       value: 'N',
    //     },
    //     {
    //       label: '고장',
    //       value: 'Y',
    //     },
    //   ],
    // },
    // {
    //   type: 'input',
    //   label: '충전소명',
    //   placeholder: '충전소를 입력해주세요',
    //   onChange(e: any) {
    //     handleQueryChange('name', e.target.value);
    //   },
    // },
    {
      type: 'select',
      label: '지역',
      value: queryState.region,
      onChange(value: any) {
        handleQueryChange('region', value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '서울',
          value: '서울',
        },
        {
          label: '경기도',
          value: '경기도',
        },
        {
          label: '인천',
          value: '인천',
        },
        {
          label: '강원',
          value: '강원',
        },
        {
          label: '충북',
          value: '충북',
        },
        {
          label: '세종',
          value: '세종',
        },
        {
          label: '대전',
          value: '대전',
        },
        {
          label: '충남',
          value: '충남',
        },
        {
          label: '전북',
          value: '전북',
        },
        {
          label: '광주',
          value: '광주',
        },
        {
          label: '전남',
          value: '전남',
        },
        {
          label: '경북',
          value: '경북',
        },
        {
          label: '대구',
          value: '대구',
        },
        {
          label: '울산',
          value: '울산',
        },
        {
          label: '경남',
          value: '경남',
        },
        {
          label: '부산',
          value: '부산',
        },
        {
          label: '제주',
          value: '제주',
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
            <Select.Option value="chgs_station_id">충전소ID</Select.Option>
            <Select.Option value="chg_charger_id">충전기ID</Select.Option>
            <Select.Option value="modelName">모델명</Select.Option>
            {/* <Select.Option value="manufacturerId">제조사</Select.Option> */}
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
