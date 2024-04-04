import { useState, useEffect, useRef } from 'react';

import dayjs from 'dayjs';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { status } from 'utils/test/FilterSwitch';

import HDOAdminRegister from './HDOAdminRegister';
import HDOAdminEdit from './HDOAdminEdit';
import { type StateInterface } from 'interfaces/ICommon';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface HDOAdminGridTableProps {
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

const HDOAdminGridTable = ({
  loading,
  data,
  state,
  setState,
  queryState,
  setQueryState,
  totalCount,
  setCheckRowId,
  checkRowId,
}: HDOAdminGridTableProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [HDOId, setHDOId] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const HDOAdminGrid = useRef<AUIGrid>(null);

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
        return value ? value - _rowIndex : '-';
      },
    },

    {
      dataField: 'accountId',
      headerText: '사번',
      width: 150,
    },
    {
      dataField: 'name',
      headerText: '이름',
      width: 150,
    },
    {
      dataField: 'role',
      headerText: '권한',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name ?? '-';
      },
    },
    {
      dataField: 'status',
      headerText: '이용유무',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'ACTIVE' ? '이용' : '중지';
      },
    },
    {
      dataField: 'Person',
      headerText: '부서',
      width: 150,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.ORG1;
      },
    },
    {
      dataField: 'Person',
      headerText: '직급',
      width: 150,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.JKW1;
      },
    },
    {
      dataField: 'email',
      headerText: '이메일',
    },

    {
      dataField: 'phoneNo',
      headerText: '전화',
      width: 120,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   // 전화번호 마스킹 처리 로직
      //   const dash = value?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      //   return dash;
      // },
    },
    {
      dataField: 'Person',
      headerText: '유선번호',
      width: 120,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.PHONE2 !== 'null' ? value?.PHONE2 : '-';
      },
    },
    // {
    //   dataField: 'currentAccessDateTime',
    //   headerText: '최근접속',
    //   width: '7%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return dayjs(value).format('YYYY-MM-DD');
    //   },
    // },
    {
      dataField: 'createdAt',
      headerText: '가입일',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
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
    //       setHDOId(event.item.id);
    //       setIsModalOpen(true);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    enableRestore: true,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: true,
    showRowCheckColumn: true,
    selectionMode: 'multipleRows',
  };

  const requestAddData = async () => {
    const grid = HDOAdminGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/web/users?userType=hdo&org=hdo&rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&status=${queryState.status}`;

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
      const grid = HDOAdminGrid.current as AUIGrid;

      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setHDOId(event.item.id);
          setIsModalOpen(true);
        },
      );
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
      // grid.bind(
      //   IGrid.EventKind.CellDoubleClick,
      //   (event: IGrid.CellDoubleClickEvent) => {
      //     setHDOId(event.item.id);
      //   },
      // );
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
      await deleteBatchApi(
        {
          url: `/v1/web/users`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     alert(error);
        //   }
        // },
      );
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
          label="HDO 관리자"
          myGrid={HDOAdminGrid}
          onDelete={handleDeleteRow}
        >
          {<HDOAdminRegister state={state} setState={setState} />}
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={HDOAdminGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </GridContainer>

      <HDOAdminEdit
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        state={state}
        setState={setState}
        HDOId={HDOId}
        setHDOId={setHDOId}
      />
    </>
  );
};

export default HDOAdminGridTable;
