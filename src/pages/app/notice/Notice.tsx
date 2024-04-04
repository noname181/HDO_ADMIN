import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type SetStateAction,
  type Dispatch,
} from 'react';
import NoticeGrid from './NoticeGrid';
import {
  GridContainer,
  Filter,
  DefaultDiv,
  AUIGridContainer,
  Spinner,
  GridButton,
} from 'styles/style';
import { AddData } from './AddData';
import { NoticeEdit } from './NoticeEdit';

import { Select } from 'components/common/Select/Select';
import { TableButton } from 'components/common/Button/TableButton';
import { Input } from 'components/common/Input/Input';
import { useGetListWt } from 'hooks/useGetListWt';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { type INotice, type StateInterface } from 'interfaces/ICommon';
import NoticeGridHeader from './NoticeGridHeader';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface Props {
  search?: boolean;
  titleInput: string;
  settitleInput: Dispatch<SetStateAction<string | ''>>;
}
export const Notice = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [NoticeId, setNoticeId] = useState<number | ''>('');
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
  }: UseGetListResponse<INotice> = useGetListWt({
    url: `/v1/notice?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&title=${queryState.title}`,
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
        {/* <Filter>
        <Input
          label="제목"
          value={titleInput}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            settitleInput(event.target.value);
          }}
        />
      </Filter> */}
        <NoticeGridHeader
          queryState={queryState}
          setQueryState={setQueryState}
          refetch={refetch}
          setCheckRowId={setCheckRowId}
        />

        <NoticeGrid
          data={data}
          state={state}
          loading={loading}
          setState={setState}
          setIsEditOpen={setIsEditOpen}
          setNoticeId={setNoticeId}
          totalCount={totalCount}
          queryState={queryState}
          setQueryState={setQueryState}
          setCheckRowId={setCheckRowId}
          checkRowId={checkRowId}
        />

        <NoticeEdit
          state={state}
          setState={setState}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          setNoticeId={setNoticeId}
          NoticeId={NoticeId}
        />
      </DefaultDiv>
    </>
  );
};
