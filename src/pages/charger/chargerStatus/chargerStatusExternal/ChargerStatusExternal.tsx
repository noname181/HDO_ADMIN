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
import { GridContainer, Filter } from 'styles/style';
import { ChargerStatusExternalGrid } from './ChargerStatusExternalGrid';
import { Input } from 'components/common/Input/Input';
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
const ChargerStatusExternal = () => {
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
  }
  const [queryState, setQueryState] = useState<PaymentHistory>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
  });
  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();

  const ChargerStatusExternalGridHeader = ({
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

    return (
      <DefaultDiv>
        <GridRefetch refetch={refetch} />
        <GridHeader container grid>
          <Select
            label="속도"
            options={[
              { value: 'all', label: '전체' },
              { value: 'v1', label: '200kWh' },
              { value: 'v2', label: '100kWh' },
              { value: 'v3', label: '50kWh' },
              { value: 'v4', label: '7kWh' },
            ]}
          />
        </GridHeader>
      </DefaultDiv>
    );
  };
  return (
    <DefaultDiv>
      <DefaultDiv>
        <ChargerStatusExternalGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
        />
      </DefaultDiv>
      <GridContainer height="calc(100vh - 15.7rem)">
        <ChargerStatusExternalGrid />
      </GridContainer>
    </DefaultDiv>
  );
};
export default ChargerStatusExternal;
