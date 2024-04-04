import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { category, handCarWash } from 'utils/stationUtils';
import { closed } from 'utils/test/FilterSwitch';
import { areaText, branchText } from 'utils/codelookup';
import StationEdit from 'components/Affiliation/StationManage/Modal/StationEdit';
import StationRegister from 'components/Affiliation/StationManage/Modal/StationRegister';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { deleteBatchApi } from 'apis/deleteBatchApi';

const StationGridTable = ({
  loading,
  data,
  totalCount,
  queryState,
  setQueryState,
  state,
  setState,
}: any) => {
  const [stationData, setStationData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const stationGrid = useRef<AUIGrid>(null);

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
      dataField: 'closed',
      headerText: '상태',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        return closed(value);
      },
    },
    {
      dataField: 'category',
      headerText: '구분',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value);
      },
    },
    {
      dataField: 'fullname',
      headerText: '주유소명',
      width: '18%',
      minWidth: 200,
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      width: 150,
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
      //   const showEv = _item?.category === 'EV_DIV' ? 'EV사업부' : value;
      //   return showEv;
      // },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      width: 150,
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
      //   const showEv = _item?.category === 'EV_DIV' ? 'EV사업부' : value;
      //   return showEv;
      // },
    },
    // {
    //   dataField: 'haveCarWash',
    //   headerText: '세차장',
    //   width: 80,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return handCarWash(value);
    //   },
    // },
    {
      dataField: 'contactName',
      headerText: '대표자',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'contactPhoneNo',
      headerText: '연락처',
      width: 120,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'address',
      headerText: '주소',
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
    //       setStationData(event.item);
    //       setIsModalOpen(true);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    height: '100%',
    width: '100%',
    fillColumnSizeMode: true,
    enableColumnResize: false,
    headerHeights: [40],
    enableSorting: false,
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'singleRow',
    // showRowCheckColumn: true,
  };

  const requestAddData = async () => {
    const grid = stationGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/orgs?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&area=${queryState.area}&branch=${queryState.branch}&closed=${queryState.closed}&cate=station&division=${queryState.cate}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data2);
      })
      .catch((error) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
        console.log(error);
      });
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = stationGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setStationData(event.item);
          setIsModalOpen(true);
        },
      );
      // 셀더블클릭 이벤트 바인딩
      // grid.bind(
      //   IGrid.EventKind.CellDoubleClick,
      //   (event: IGrid.CellDoubleClickEvent) => {
      //     setStationData(event.item);
      //     setIsModalOpen(true);
      //   },
      // );

      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
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
      // grid.bind(
      //   IGrid.EventKind.RowCheckClick,
      //   (event: IGrid.RowCheckClickEvent) => {
      //     if (event.checked) {
      //       // console.log(event.item);
      //       setCheckRowId((value) => [...value, event.item.id]);
      //     }
      //     if (!event.checked) {
      //       setCheckRowId((value) => {
      //         const newCheckRowId = value.filter(
      //           (item) => item !== event.item.id,
      //         );
      //         return newCheckRowId;
      //       });
      //     }
      //   },
      // );
      // grid.bind(
      //   IGrid.EventKind.RowAllChkClick,
      //   (event: IGrid.RowAllChkClickEvent) => {
      //     if (event.checked) {
      //       const dataItems = grid?.getGridData() as Array<{ id: number }>;
      //       setCheckRowId(dataItems.map((item) => item.id));
      //     } else {
      //       setCheckRowId([]);
      //     }
      //   },
      // );
      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // console.log(data2);
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);

  // async function onDeleteRow() {
  //   // console.log(checkRowId);
  //   const dataToSend = {
  //     orgIds: checkRowId,
  //   };
  //   const isConfirmed = window.confirm('정말로 삭제할까요?');
  //   if (isConfirmed) {
  //     await deleteBatchApi(
  //       {
  //         url: `/org/delete-batch`,
  //         data: dataToSend,
  //       },
  //       setState,
  //       (error) => {
  //         if (error) {
  //           alert(error);
  //         }
  //       },
  //     );
  //     setCheckRowId([]);
  //   }
  // }

  // function handleDeleteRow() {
  //   if (checkRowId.length === 0) {
  //     alert('대상을 선택하세요.');
  //   } else {
  //     void onDeleteRow();
  //   }
  // }
  // useEffect(() => {
  //   console.log(checkRowId);
  // }, [checkRowId]);
  return (
    <GridContainer height="calc(100vh - 18.825rem)">
      <GridButton label="사업장 목록" myGrid={stationGrid}>
        <StationRegister state={state} setState={setState} />
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={stationGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>

      <StationEdit
        state={state}
        setState={setState}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        stationData={stationData}
        setStationData={setStationData}
      />
    </GridContainer>
  );
};

export default StationGridTable;
