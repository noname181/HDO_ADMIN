import { useState } from 'react';

// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 전역상태관리 recoil / AlertModal
// import { useRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';

// 타입
import { type StateInterface, type TabIDInterface } from 'interfaces/ICommon';
// antd
import { Form } from 'antd';

// 스타일
import { GridContainer } from 'styles/style';
import { ChargerStatusAdminGrid } from './ChargerStatusAdminGrid';
import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { Select } from 'components/common/Select/Select';

const ChargerStatusAdmin = () => {
  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };

  // api 호출 데이터 상태
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  interface PaymentHistory {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    org: '' | 'STT_DIR' | 'STT_FRN';
    status: '' | 'active' | 'inactive';
    failure: '' | 'active' | 'inactive';
    unexported_car: '' | 'active' | 'inactive';
  }
  const [queryState, setQueryState] = useState<PaymentHistory>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    org: '',
    status: '',
    failure: '',
    unexported_car: '',
  });
  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();

  const ChargerStatusAdminyGridHeader = ({
    queryState,
    setQueryState,
    refetch,
  }: QueryStateInterface<any>) => {
    const [areaNo, setAreaNo] = useState('');
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
            label: '자영/가맹점',
            value: 'STT_FRN',
          },
        ],
      },
      {
        type: 'radio',
        label: '운영',
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
            label: '운영',
            value: 'active',
          },
          {
            label: '정지',
            value: 'inactive',
          },
        ],
      },
      {
        type: 'input',
        label: '충전소 ID',
        value: queryState.chgs_station_id,
        onChange(e: any) {
          handleQueryChange('chgs_station_id', e.target.value);
        },
      },
      {
        type: 'select',
        label: '속도',
        value: queryState.speed,
        onChange(e: any) {
          handleQueryChange('speed', e.target.value);
        },
        listData: [
          { value: 'all', label: '전체' },
          { value: 'v1', label: '200kWh' },
          { value: 'v2', label: '100kWh' },
          { value: 'v3', label: '50kWh' },
          { value: 'v4', label: '7kWh' },
        ],
      },

      {
        type: 'radio',
        label: '고장여부 ',
        value: queryState.failure,
        onChange(e: any) {
          handleQueryChange('failure', e.target.value);
        },
        listData: [
          {
            label: '전체',
            value: '',
          },
          {
            label: '고장',
            value: 'active',
          },
          {
            label: '미고장',
            value: 'inactive',
          },
        ],
      },
      {
        type: 'radio',
        label: '미출차  ',
        value: queryState.unexported_car,
        onChange(e: any) {
          handleQueryChange('unexported_car', e.target.value);
        },
        listData: [
          {
            label: '전체',
            value: '',
          },
          {
            label: '이동',
            value: 'active',
          },
          {
            label: '미이동',
            value: 'inactive',
          },
        ],
      },
      {
        type: 'input',
        label: '충전소명 ',
        value: queryState.chgs_station_name,
        onChange(e: any) {
          handleQueryChange('chgs_station_name', e.target.value);
        },
      },
    ];

    return (
      <DefaultDiv>
        <GridRefetch refetch={refetch} />
        <GridHeader container grid>
          <AreaSelectList
            value={queryState.area}
            onChange={(e: any) => {
              setAreaNo(e);
              setQueryState({
                ...queryState,
                area: e,
                branch: '',
                rpp: 50,
                page: 0,
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
                rpp: 50,
                page: 0,
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
  return (
    <DefaultDiv>
      <ChargerStatusAdminyGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        // refetch={refetch}
      />
      <GridContainer height="calc(100vh - 18.8rem)">
        <ChargerStatusAdminGrid />
      </GridContainer>
    </DefaultDiv>
  );
};
export default ChargerStatusAdmin;
