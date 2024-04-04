import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import dayjs from 'dayjs';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type StateInterface } from 'interfaces/ICommon';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { useNavigate } from 'react-router-dom';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}

const MonthlySettlementGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: StationGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

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
      dataField: 'data_month',
      headerText: '정산월',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },
    {
      dataField: 'total_payment',
      headerText: '지급 대상금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(Number(value)) + '원'
          : '0';
      },
    },

    {
      dataField: 'total_deposit_amount',
      headerText: '총 이체금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(Number(value)) + '원'
          : '0';
      },
    },
    {
      dataField: 'total_ignore_kwh',
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
      dataField: 'total_payment_minus_deposit_amount',
      headerText: '미정산금',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(Number(value)) + '원'
          : '0';
      },
    },

    {
      dataField: 'edit',
      headerText: '상세보기',
      width: '3%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '상세',
        onClick: function (event) {
          // setIsEditOpen(true);
          const url = `/monthly-settlement/${event?.item?.key as string}`;
          navigate(url);
        },
      },
    },
  ];

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

  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/monthly-payment?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&month=${queryState.month}`;

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
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

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
            setCheckRowId(dataItems?.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // fake data

      // 그리드 데이터 세팅
      grid?.setGridData(data3);
    }
  }, [loading, data]);

  return (
    <>
      <GridButton label="수금 내역" myGrid={myGrid}></GridButton>
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
export default MonthlySettlementGrid;
