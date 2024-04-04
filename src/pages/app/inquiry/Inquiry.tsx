import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type SetStateAction,
  type Dispatch,
} from 'react';
import InquiryGrid from './InquiryGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';
import { InquiryEdit } from './InquiryEdit';

import { Select } from 'components/common/Select/Select';
import { TableButton } from 'components/common/Button/TableButton';
import { Input } from 'components/common/Input/Input';
import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type IInquiry, type StateInterface } from 'interfaces/ICommon';
import InquiryGridHeader from './InquiryGridHeader';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface Props {
  search?: boolean;
  contentInput: string;
  setcontentInput: Dispatch<SetStateAction<string | ''>>;
}
export const Inquiry = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [InquiryId, setInquiryId] = useState<number | ''>('');
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
  }: UseGetListResponse<IInquiry> = useGetListWt({
    url: `/v1/inquiry?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&content=${queryState.content}`,
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
  // useEffect(() => {
  //   refetch();
  // }, [search]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };
  return (
    <>
      <DefaultDiv>
        <InquiryGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          setCheckRowId={setCheckRowId}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          {/* <TableButton
            isExcel={false}
            label="1:1문의"
            inactive={emptyFunction}
            register={handleOpenModal}
            isRegiter={false}
          /> */}
          <InquiryGrid
            data={data}
            state={state}
            loading={loading}
            setState={setState}
            setIsEditOpen={setIsEditOpen}
            setInquiryId={setInquiryId}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
          <InquiryEdit
            state={state}
            setState={setState}
            isEditOpen={isEditOpen}
            setIsEditOpen={setIsEditOpen}
            setInquiryId={setInquiryId}
            InquiryId={InquiryId}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
