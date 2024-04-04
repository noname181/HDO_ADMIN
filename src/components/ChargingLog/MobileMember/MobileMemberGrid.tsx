import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useGetListWt } from 'hooks/useGetListWt';
import { type UpdateInterface } from 'interfaces/IChgUpdate';
import { type StateInterface } from 'interfaces/ICommon';
import { postApi } from 'apis/postApi';
import { DefaultDiv } from 'styles/style';
import { alertModalState } from 'recoil/modalState';
import { MobileMemberGridTable } from './MobileMemberGridTable';
import { MobileMemberGridHeader } from './MobileMemberGridHeader';

export const MobileMemberGrid = () => {
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [queryState, setQueryState] = useState({
    rpp: 50, // 1page data 조회 갯수
    page: 0, // rpp에 따른 조회 페이지 번호
    odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: '',
    searchVal: '',
    startDate: '',
    endDate: '',
    update: '',
  });
  const { loading, data, refetch, totalCount } = useGetListWt<UpdateInterface>({
    url: `/example/qr?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}`,
  });
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      reload();
      setState({
        ...state,
        isSuccess: false,
      });
    }
    if (state.error) {
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

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });

    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50, // 1page data 조회 갯수
      page: 0, // rpp에 따른 조회 페이지 번호
      odby: 'DESC', // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
      searchKey: '',
      searchVal: '',
      startDate: '',
      endDate: '',
      update: '',
    });

    refetch();
  };

  return (
    <DefaultDiv>
      <MobileMemberGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
      />
      <MobileMemberGridTable
        loading={loading}
        data={data}
        totalCount={totalCount}
        queryState={queryState}
        setQueryState={setQueryState}
      />
      {/* <QRModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    </DefaultDiv>
  );
};
