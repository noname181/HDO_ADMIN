import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type StateInterface } from 'interfaces/ICommon';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { useNavigate } from 'react-router-dom';
import ERPGrid from './ERPGrid';
import PGGrid from './PGGrid';
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

const DailyPaymentGrid = ({
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
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const navigate = useNavigate();
  const [modalERPData, setModalERPData] = useState<string | number>('');
  const [modalPGData, setModalPGData] = useState<string | number>('');
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
      headerText: '수금일자',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const stringValue =
          typeof value === 'number' ? value.toString() : value;

        const year = stringValue?.slice(0, 4);
        const month = stringValue?.slice(4, 6)?.padStart(2, '0');
        const day = stringValue?.slice(6, 8)?.padStart(2, '0');

        const formattedString2 = `${String(year)}-${String(month)}-${String(
          day,
        )}`;
        return formattedString2;
      },
    },
    {
      dataField: 'deposit_count',
      headerText: '이체 건수',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },

    {
      dataField: 'deposit_amount',
      headerText: '총 이체금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },

    {
      dataField: 'deposit_count',
      headerText: '펌팽킹 정산 결과',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, item) {
      //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //   return `${
      //     item?.count_data_results_tb_S
      //       ? new Intl.NumberFormat('en-US').format(
      //           item?.count_data_results_tb_S,
      //         )
      //       : 0
      //   } (${
      //     item?.count_data_results_tb_E
      //       ? new Intl.NumberFormat('en-US').format(
      //           item?.count_data_results_tb_E,
      //         )
      //       : 0
      //   })`;
      // },
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          return value;
        },
      },
      labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // setModalPGData(event?.item?.salesDate);
            if (event.dataField === 'deposit_count') {
              const yearData = event?.item?.data_day.substr(0, 4);
              const monthData = event?.item?.data_day.substr(4, 2);
              const dayData = event?.item?.data_day.substr(6, 2);

              const formattedDateString = `${yearData}-${monthData}-${dayData}`;
              setModalPGData(formattedDateString);
            }
          },
        );
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },

    {
      dataField: 'totalCountERP',
      headerText: 'ERP전송결과',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, item) {
      //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //   return `${
      //     item.count_erp_results_tb_S
      //       ? new Intl.NumberFormat('en-US').format(
      //           item?.count_erp_results_tb_S,
      //         )
      //       : 0
      //   } (${
      //     item.count_erp_results_tb_E
      //       ? new Intl.NumberFormat('en-US').format(
      //           item?.count_erp_results_tb_E,
      //         )
      //       : 0
      //   })`;
      // },
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          return value;
        },
      },
      labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // setModalPGData(event?.item?.salesDate);
            if (event.dataField === 'totalCountERP') {
              const yearData = event?.item?.data_day.substr(0, 4);
              const monthData = event?.item?.data_day.substr(4, 2);
              const dayData = event?.item?.data_day.substr(6, 2);

              const formattedDateString = `${yearData}-${monthData}-${dayData}`;
              setModalERPData(formattedDateString);
            }
          },
        );
        return value ? new Intl.NumberFormat('en-US').format(value) : '-';
      },
    },
    {
      dataField: 'edit',
      headerText: '일수금 상세',
      width: '3%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '상세',
        onClick: function (event) {
          console.log(event?.item?.data_day);
          // setIsEditOpen(true);
          const url = `/daily-payment/${event?.item?.data_day as string}`;
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
    const url = `/daily-payment?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&endDate=${queryState.endDate}&startDate=${queryState.startDate}`;

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

      // 그리드 데이터 세팅
      // grid2.setGridData(datafake);
      grid.setGridData(data3);
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
        <ERPGrid
          // state={state}
          // setState={setState}
          setModalERPData={setModalERPData}
          modalERPData={modalERPData}
        />
        <PGGrid
          // state={state}
          // setState={setState}
          setModalPGData={setModalPGData}
          modalPGData={modalPGData}
        />
      </AUIGridContainer>
    </>
  );
};
export default DailyPaymentGrid;
