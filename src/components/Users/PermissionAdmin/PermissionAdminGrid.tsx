import { useState, useEffect } from 'react';

import { useGetListWt } from 'hooks/useGetListWt';

import PermissionAdminGridHeader from './PermissionAdminGridHeader';
import PermissionAdminGridTable from './PermissionAdminGridTable';
import { DefaultDiv } from 'styles/style';
import { type IPermissions } from 'interfaces/ICommon';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const HDOAdminGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    name: '',
  });

  const { loading, totalCount, data, refetch } = useGetListWt<IPermissions>({
    url: `/v1/web/auth/roles?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&name=${queryState.name}`,
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

      reload();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
    });
    setCheckRowId([]);

    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      name: '',
    });
    setCheckRowId([]);

    refetch();
  };
  // console.log(data);
  return (
    <DefaultDiv>
      <PermissionAdminGridHeader
        queryState={queryState}
        setQueryState={setQueryState}
        refetch={search}
        reload={reload}
      />
      <PermissionAdminGridTable
        loading={loading}
        data={data}
        state={state}
        setState={setState}
        queryState={queryState}
        setQueryState={setQueryState}
        totalCount={totalCount}
        setCheckRowId={setCheckRowId}
        checkRowId={checkRowId}
      />
    </DefaultDiv>
  );
};

export default HDOAdminGrid;
