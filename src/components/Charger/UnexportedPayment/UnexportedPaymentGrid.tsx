import { useState } from 'react';
import Tabs from 'components/common/Tab/Tabs';
// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 전역상태관리 recoil / AlertModal
// import { useRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';

// 타입
import { type StateInterface, type TabIDInterface } from 'interfaces/ICommon';
// antd
// import { Form } from 'antd';
// import { Select } from 'components/common/Select/Select';
// import { Input } from 'components/common/Input/Input';
// 스타일
import {
  GridContainer,
  // Filter,
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';
import UnexportedPaymentGridTable from './UnexportedPaymentGridTable';
import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import { StyledSelectInput } from 'components/common/test/Styled.ant';
const UnexportedPaymentGrid = () => {
  // const emptyFunction: () => void = () => {
  //   // 비워져 있는 함수
  // };

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
    division: '' | 'STORE' | 'EMPLOYMERCHAN';
    member: '' | 'Y' | 'N';
    reservation: '' | 'Y' | 'N';
    vehicle: '' | 'Y' | 'N';
    payType: '' | 'pre' | 'partial';
  }
  const [queryState, setQueryState] = useState<PaymentHistory>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    division: '',
    member: '',
    reservation: '',
    vehicle: '',
    payType: '',
  });
  const dataTabItems = [
    {
      id: '/unexported-payment',
      label: '미출차 결제 내역',
    },
  ];
  const [tabState, setTabState] = useState<TabIDInterface>({
    id: dataTabItems[0].id,
  });
  // function reloadData() {

  //   if (refetch) {
  //     refetch();
  //   }
  // }
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    // {
    //   type: 'select',
    //   label: '결제 방법',
    //   onChange(e: any) {},
    //   listData: [
    //     {
    //       value: '',
    //       label: '전체',
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
          label: '직영점',
          value: 'STORE',
        },
        {
          label: '자영/가맹점',
          value: 'EMPLOYMERCHAN',
        },
      ],
    },
    {
      type: 'radio',
      label: '사용자분류',
      value: queryState.member,
      onChange(e: any) {
        handleQueryChange('member', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '회원',
          value: 'Y',
        },
        {
          label: '비회원',
          value: 'N',
        },
      ],
    },
    {
      type: 'radio',
      label: '충전예약',
      value: queryState.reservation,
      onChange(e: any) {
        handleQueryChange('reservation', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '예약',
          value: 'Y',
        },
        {
          label: '비예약',
          value: 'N',
        },
      ],
    },
    {
      type: 'radio',
      label: '미출차',
      value: queryState.vehicle,
      onChange(e: any) {
        handleQueryChange('vehicle', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '이동',
          value: 'Y',
        },
        {
          label: '미이동',
          value: 'N',
        },
      ],
    },
    // {
    //   type: 'input',
    //   label: '충전소 ID',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '충전소명',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '충전기 ID',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   onChange(e: any) {},
    // },
    // {
    //   type: 'input',
    //   label: '충전소ID',
    //   onChange(e: any) {},
    // },
  ];
  return (
    <>
      <DefaultDiv>
        <GridRefetch />
        <GridHeader container grid>
          <StyledSelectInput>
            <Select
              // label=""
              options={[
                { label: '전체', value: '' },
                { label: '충전소 ID', value: '충전소 ID' },
                { label: '충전소명', value: '충전소명' },
                { label: '충전기 ID', value: '충전기 ID' },
                { label: '유저 ID', value: '유저 ID' },
                { label: '이름', value: '이름' },
                { label: '전화번호', value: '전화번호' },
              ]}
              onChange={(value) => {}}
            />
            <Input onChange={(value) => {}} />
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
        </GridHeader>
        <UnexportedPaymentGridTable />
      </DefaultDiv>
    </>
  );
};
export default UnexportedPaymentGrid;
