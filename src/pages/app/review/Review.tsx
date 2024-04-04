import React, {
  useEffect,
  useState,
  type SetStateAction,
  type Dispatch,
} from 'react';
import ReviewGrid from './ReviewGrid';
import { DefaultDiv } from 'styles/style';

import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type IReview, type StateInterface } from 'interfaces/ICommon';
import ReviewGridHeader from './ReviewGridHeader';
import { ReviewEdit } from './ReviewEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const Review = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [ReviewId, setReviewId] = useState<number | ''>('');
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    content: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<IReview> = useGetListWt({
    url: `/v1/review?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&content=${queryState.content}`,
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
      setCheckRowId([]);

      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);

  useEffect(() => {
    // 등록 에러
    if (state.error?.errorCode) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  return (
    <>
      <DefaultDiv>
        <ReviewGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          setCheckRowId={setCheckRowId}
        />

        <ReviewGrid
          data={data}
          state={state}
          loading={loading}
          setState={setState}
          setIsEditOpen={setIsEditOpen}
          setReviewId={setReviewId}
          totalCount={totalCount}
          queryState={queryState}
          setQueryState={setQueryState}
          setCheckRowId={setCheckRowId}
          checkRowId={checkRowId}
        />

        <ReviewEdit
          state={state}
          setState={setState}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          setReviewId={setReviewId}
          ReviewId={ReviewId}
        />
      </DefaultDiv>
    </>
  );
};
