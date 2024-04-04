import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type StateInterface } from 'interfaces/ICommon';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
// import dayjs from 'dayjs';
// import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
interface ChargerErrorHistoryGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  // setCheckRowId: any;
  // checkRowId: any;
}
export const ChargerErrorHistoryGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
}: // setCheckRowId,
// checkRowId,
ChargerErrorHistoryGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    rowIdField: 'id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    enableRestore: true,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: false,
    // showRowCheckColumn: true,
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charger-error-history?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&reason=${queryState.reason}`;
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
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',

      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'chargingStationUseLog',
      headerText: '충전소명',
      width: '6%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'chargerUseLog',
      headerText: '충전기 ID',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chg_charger_id ?? '-';
      },
    },
    {
      dataField: 'cl_start_datetime',
      headerText: '충전시작시간',
      width: 160,
    },
    {
      dataField: 'cl_end_datetime',
      headerText: '충전종료시간',
      width: 160,
    },
    {
      dataField: 'cl_start_meter',
      headerText: '시작미터',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },
    {
      dataField: 'cl_stop_meter',
      headerText: '종료미터',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },
    {
      dataField: 'desired_kwh',
      headerText: '충전요청량(kWh)',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value
          ? new Intl.NumberFormat('en-US').format(value / 1000)
          : '-';
      },
    },
    {
      dataField: 'cl_kwh',
      headerText: '충전량(kWh)',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value
          ? new Intl.NumberFormat('en-US').format(value / 1000)
          : '-';
      },
    },
    {
      dataField: 'reason',
      headerText: '오류코드',
      labelFunction(_rowIndex, _columnIndex, value) {
        // return value || '-';
        switch (value) {
          case 'Local':
            return 'Local';
          case 'Remote':
            return 'Remote';
          case 'Other':
            return 'Other';
          case 'EVDisconnected':
            return 'EVDisconnected';
          case 'EmergencyStop':
            return 'EmergencyStop';
          case 'PowerLoss':
            return 'PowerLoss';
          case 'Reboot':
            return 'Reboot';
          case 'HardReset':
            return 'HardReset';
          // case '충전기에러':
          //   return '충전기 에러';
          case 'SoftReset':
            return 'SoftReset';
          case 'DeAuthorized':
            return 'DeAuthorized';
          default:
            return '-';
        }
      },
    },
  ];

  // 그리드 이벤트 세팅
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      // console.log(data);
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

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
      //       setCheckRowId((value: any) => [...value, event.item.id]);
      //     }
      //     if (!event.checked) {
      //       setCheckRowId((value: any) => {
      //         const newCheckRowId = value.filter(
      //           (item: any) => item !== event.item.id,
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
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);

  return (
    <>
      <GridButton label="내역" myGrid={myGrid}></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
export default ChargerErrorHistoryGrid;
