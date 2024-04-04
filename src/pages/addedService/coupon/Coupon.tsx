import { useEffect, useState } from 'react';

// api
// import { useGetListWt } from 'hooks/useGetListWt';

// 타입
import { type StateInterface, type ICoupon } from 'interfaces/ICommon';
// 스타일
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';

import { CouponGrid } from './CouponGrid';
import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { CouponEdit } from './CouponEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
export const Coupon = () => {
  const [couponNumber, setCouponNumber] = useState('');
  const [CouponId, setCouponId] = useState<number | ''>('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    couponNumber: '',
  });
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'input',
      label: '쿠폰 번호',
      value: queryState.couponNumber,
      onChange(e: any) {
        handleQueryChange('couponNumber', e.target.value);
        setCouponNumber(e.target.value);
      },
    },
  ];
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<ICoupon> = useGetListWt({
    url: `/coupon?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&number=${queryState.couponNumber}`,
  });

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);
  // useEffect(() => {
  //   refetch();
  // }, [search]);

  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };
  function reloadData() {
    setQueryState({
      ...queryState,
      couponNumber: '',
    });
    setCouponNumber('');
    if (refetch) {
      refetch();
    }
  }
  // api 호출 데이터 상태

  interface Coupon {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    memthod: string;
    qty: number;
  }

  return (
    <>
      <DefaultDiv>
        {/* <Filter>
          <Input
            label="쿠폰 번호"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setCouponNumber(event.target.value);
            }}
          />
        </Filter> */}
        <DefaultDiv>
          <GridRefetch refetch={refetch} reload={reloadData} />
          <GridHeader container grid>
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

        <CouponGrid
          data={data}
          state={state}
          loading={loading}
          setState={setState}
          setIsEditOpen={setIsEditOpen}
          setCouponId={setCouponId}
          totalCount={totalCount}
          queryState={queryState}
          setQueryState={setQueryState}
        />

        <CouponEdit
          state={state}
          setState={setState}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          setCouponId={setCouponId}
          CouponId={CouponId}
        />
      </DefaultDiv>
    </>
  );
};
