import { useState, useEffect, useRef } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';

import { type StateInterface } from 'interfaces/ICommon';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import PermissionAdminRegister from './Model/PermissionAdminRegister';
import PermissionAdminEdit from './Model/PermissionAdminEdit';

interface PermissionGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  totalCount: number | null;
  setCheckRowId: any;
  checkRowId: any;
}

const PermissionAdminGridTable = ({
  loading,
  data,
  state,
  setState,
  queryState,
  setQueryState,
  totalCount,
  setCheckRowId,
  checkRowId,
}: PermissionGridTableProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [rolesId, setRolesId] = useState<string>('');
  const PermissionAdminGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value ? value - _rowIndex : '';
      },
    },
    {
      dataField: 'name',
      headerText: '메뉴권한이름',
      style: 'text-left',
      labelFunction: function (_rowIndex, _columnIndex, value, _item) {
        return value;
      },
    },

    // {
    //   dataField: 'edit',
    //   headerText:
    //     '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
    //   width: '4%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.IconRenderer,
    //     iconWidth: 18,
    //     iconHeight: 18,
    //     iconTableRef: {
    //       default: './assets/img/icon/icon-edit.png',
    //     },
    //     onClick: function (event) {
    //       setRolesId(event.item.id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    editable: false,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
    showRowCheckColumn: true,
  };
  const requestAddData = async () => {
    const grid = PermissionAdminGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/web/auth/roles?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&name=${queryState.name}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log('result::', result);

        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data2);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
          content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
      });
  };
  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      const grid = PermissionAdminGrid.current as AUIGrid;
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setRolesId(event.item.id);
        },
      );
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.id,
              );
              return newCheckRowId;
            });
          }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          if (event.checked) {
            const dataItems = grid?.getGridData() as Array<{ id: number }>;
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
          // console.log(event);
          const rowCount = grid.getRowCount();
          if (rowCount === totalCount) {
            grid.unbind(IGrid.EventKind.VScrollChange);
            return;
          }
          if (event.position === event.maxPosition) {
            void requestAddData();
          }
        },
      );

      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // console.log(data2);
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);

  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      ids: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      setState({ isLoading: true, error: null, isSuccess: false });
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const url = `/v1/web/auth/roles?ids=[${checkRowId}]`;
      const accessToken = localStorage.getItem('accessToken') ?? '';
      if (!accessToken) return;
      const axios = hdoInstance();
      axios
        .delete(url, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((result) => {
          // console.log('result::', result);
          setState({ isLoading: false, error: null, isSuccess: true });
        })
        .catch((error) => {
          console.log(error);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title:
              error.response.data?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
            content:
              error.response.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
          });
        });
      setCheckRowId([]);
    }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }
  return (
    <>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton
          label="권한관리"
          myGrid={PermissionAdminGrid}
          onDelete={handleDeleteRow}
        >
          <PermissionAdminRegister state={state} setState={setState} />
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={PermissionAdminGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
        <PermissionAdminEdit
          state={state}
          setState={setState}
          rolesId={rolesId}
          setRolesId={setRolesId}
        ></PermissionAdminEdit>
      </GridContainer>
    </>
  );
};

export default PermissionAdminGridTable;
