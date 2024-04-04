import React, {
  useEffect,
  useState,
  type SetStateAction,
  type Dispatch,
} from 'react';
import TeamsPolicyGrid from './TermsPolicyGrid';
import { GridContainer, Filter, DefaultDiv } from 'styles/style';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import TermsPolicyGridHeader from './TermsPolicyGridHeader';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface Props {
  search?: boolean;
  titleInput: string;
  settitleInput: Dispatch<SetStateAction<string | ''>>;
  cateSelected: string;
  setcateSelected: Dispatch<SetStateAction<string | ''>>;
}
interface optionSelected {
  value: string | number;
  label: string;
}
export const TermsPolicy = ({
  titleInput,
  settitleInput,
  cateSelected,
  setcateSelected,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [optionSelect, setoptionSelect] = useState<optionSelected[]>([
    { value: '', label: '전체' },
  ]);
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [TermsPolicyId, setTermsPolicyId] = useState<number | ''>('');
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/terms?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}`,
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
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });
    setCheckRowId([]);

    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
    });
    setCheckRowId([]);

    refetch();
  };
  // useEffect(() => {
  //   if (data && data.length > 0 && titleInput === '' && cateSelected === '') {
  //     const arrayCheck: string[] = [];
  //     const optionAdd: optionSelected[] = [{ value: '', label: '전체' }];
  //     data.map((value: any) => {
  //       if (arrayCheck.length > 0) {
  //         if (arrayCheck && !arrayCheck.includes(value.category)) {
  //           arrayCheck.push(value.category);
  //           optionAdd.push({ value: value.category, label: value.category });
  //         }
  //       } else {
  //         arrayCheck.push(value.category);
  //         optionAdd.push({ value: value.category, label: value.category });
  //       }
  //       return optionAdd;
  //     });
  //     setoptionSelect(optionAdd);
  //     console.log(optionAdd);
  //   }
  // }, [data]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };
  return (
    <>
      <DefaultDiv>
        <TermsPolicyGridHeader
          setcateSelected={setcateSelected}
          settitleInput={settitleInput}
          titleInput={titleInput}
          refetch={search}
          reload={reload}
          queryState={queryState}
          setQueryState={setQueryState}
        />
        <GridContainer height="calc(100vh - 15.7rem)">
          <TeamsPolicyGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            setcateSelected={setcateSelected}
            settitleInput={settitleInput}
            setTermsPolicyId={setTermsPolicyId}
            TermsPolicyId={TermsPolicyId}
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
