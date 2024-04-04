import { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  dataAll: any;
  data2: any;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  totalCount: number | null;
  queryState: any;
  keydata: string;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}

const MonthlyPaymentDetailGrid = ({
  loading,
  data,
  dataAll,
  data2,
  state,
  setState,
  totalCount,
  keydata,
  queryState,
  setQueryState,
}: StationGridTableProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const myGrid = useRef<AUIGrid>(null);
  const myGrid2 = useRef<AUIGrid>(null);
  // console.log(data);
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
      dataField: 'data_day',
      headerText: '정산월',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value;
      },
    },

    {
      dataField: 'branchName',
      headerText: '지사',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value;
      },
    },

    {
      dataField: 'station_name',
      headerText: '충전소 명',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value;
      },
    },

    {
      dataField: 'chgs_station_id',
      headerText: '충전소 ID',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'total_payment',
      headerText: '지급 대상금액',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(Number(value)) + '원'
          : '0원';
      },
    },
    {
      dataField: 'TRAMT',
      headerText: '총 이체금액',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },
    {
      dataField: 'dayignore_amount',
      headerText: '충전 판매손실',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + 'kw'
          : '0kw';
      },
    },
    {
      dataField: 'total_payment_minus_TRAMT',
      headerText: '미정산금',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'sum_total_payment',
      headerText: '지급 대상금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },

    {
      dataField: 'sumTRAMT',
      headerText: '총 이체금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },
    {
      dataField: 'sum_dayignore_amount',
      headerText: '충전 판매손실',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + 'kw'
          : '0kw';
      },
    },
    {
      dataField: 'sum_total_payment_minus_sumTRAMT',
      headerText: '미정산금',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },
  ];
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/monthly-payment-detail?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&month=${keydata}&area=${queryState.area}&branch=${queryState.branch}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Location: '/monthly-settlement',
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log('result::', result);

        const data4 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data4);
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
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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
    showRowCheckColumn: false,
  };
  const gridProps2: IGrid.Props = {
    width: '100%',
    height: 100,
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
    showRowCheckColumn: false,
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      const grid2 = myGrid2.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {},
      );
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
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          // if (event.checked) {
          //   setCheckRowId((value: any) => [...value, event.item.id]);
          // }
          // if (!event.checked) {
          //   setCheckRowId((value: any) => {
          //     const newCheckRowId = value.filter(
          //       (item: any) => item !== event.item.id,
          //     );
          //     return newCheckRowId;
          //   });
          // }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          // if (event.checked) {
          //   const dataItems = grid?.getGridData() as Array<{ id: number }>;
          //   setCheckRowId(dataItems?.map((item) => item.id));
          // } else {
          //   setCheckRowId([]);
          // }
        },
      );
      grid2?.setGridData({
        ...data2,
        sumTRAMT: dataAll.sumTRAMT,
        sum_dayignore_amount: dataAll.sum_dayignore_amount,
        sum_total_payment: dataAll.sum_total_payment,
        sum_total_payment_minus_sumTRAMT:
          dataAll.sum_total_payment_minus_sumTRAMT,
      });
      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));

      // 그리드 데이터 세팅
      grid?.setGridData(data3);
    }
  }, [loading, data]);
  return (
    <>
      <GridButton label="매출 내역" myGrid={myGrid}></GridButton>
      {state.isLoading && <Spinner />}
      <AUIGrid
        ref={myGrid2}
        columnLayout={columnLayout2}
        gridProps={gridProps2}
      />
      <AUIGridContainer
        isTableButton={true}
        from="settlementDetail"
        style={{ marginTop: 20 }}
      >
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
export default MonthlyPaymentDetailGrid;
