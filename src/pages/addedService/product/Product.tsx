import { useState } from 'react';

// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 타입
import { type StateInterface, type TabIDInterface } from 'interfaces/ICommon';
// antd
import { Form, DatePicker } from 'antd';
import { Input } from 'components/common/Input/Input';
// 스타일
import { GridContainer, Filter } from 'styles/style';
import TabHead from 'components/common/Tab/TabHead';
import { Button } from 'components/common/Button/Button';
import { ButtonGroup } from 'components/common/Button/Button.styled';
import {
  StyledForm,
  StyledFormItem,
  StyledSelect,
  StyledInputDate,
} from 'components/common/test/Styled.ant';

import { ProductGrid } from './ProductGrid';

export const Product = () => {
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
    memthod: string;
    qty: number;
  }
  const [queryState, setQueryState] = useState<PaymentHistory>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    memthod: '',
    qty: 0,
  });
  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();
  const dataTabItems = [
    {
      id: '/point',
      label: '포인트 내역',
    },
  ];
  const [tabState, setTabState] = useState<TabIDInterface>({
    id: dataTabItems[0].id,
  });
  return (
    <>
      <Filter>
        <Input label="서비스" />
      </Filter>

      <GridContainer height="calc(100vh - 15.7rem)">
        <ProductGrid />
      </GridContainer>
    </>
  );
};
