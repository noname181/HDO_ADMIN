import React, { useEffect, useState, type ChangeEvent } from 'react';
import BannerEventGrid from './BannerEventGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';

import { Input } from 'components/common/Input/Input';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import { BannerEventEdit } from './BannerEventEdit';
import BannerEventGridHeader from './BannerEventGridHeader';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

interface Props {
  search?: boolean;
}
export const BannerEvent = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    title: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/banner?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&title=${queryState.title}`,
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
      setState({
        ...state,
        isSuccess: false,
      });
      setCheckRowId([]);

      refetch();
    }
  }, [state]);

  // useEffect(() => {
  //   refetch();
  // }, [search]);

  return (
    <>
      <DefaultDiv>
        {/* <Filter>
        <Input
          label="제목"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            settitleInput(event.target.value);
          }}
        />
      </Filter> */}
        <BannerEventGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          setCheckRowId={setCheckRowId}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          {/* <TableButton
          isExcel={false}
          label="일반회원 목록"
          inactive={emptyFunction}
          register={handleOpenModal}
        /> */}
          <BannerEventGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
