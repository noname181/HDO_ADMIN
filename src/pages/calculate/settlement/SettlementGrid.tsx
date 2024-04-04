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
import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import ERPGrid from './ERPGrid';
import PGGrid from './PGGrid';
import { Navigate, useNavigate } from 'react-router-dom';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  // setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setSettlementId: Dispatch<SetStateAction<number | ''>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}

const SettlementGrid = ({
  loading,
  data,
  state,
  setState,
  // setIsEditOpen,
  setSettlementId,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: StationGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [settlementData, setSettlementData] = useState('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [modalERPData, setModalERPData] = useState<string | number>('');
  const [modalPGData, setModalPGData] = useState<string | number>('');
  const navigate = useNavigate();
  // console.log(data);
  const columnLayout: IGrid.Column[] = [
    // {
    //   dataField: 'isActive',
    //   headerText: '',
    //   headerRenderer: {
    //     type: IGrid.headerRendererKind.CheckBoxHeaderRenderer,
    //     // 헤더의 체크박스가 상호 의존적인 역할을 할지 여부(기본값:false)
    //     // dependentMode 는 renderer 의 type 으로 CheckBoxEditRenderer 를 정의할 때만 활성화됨.
    //     // true 설정했을 때 클릭하면 해당 열의 필드(데모 상은 isActive 필드)의 모든 데이터를 true, false 로 자동 바꿈
    //     dependentMode: true,
    //   },
    //   renderer: {
    //     type: IGrid.RendererKind.CheckBoxEditRenderer,
    //     editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
    //   },
    //   width: 40,
    // },
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'salesDate',
      headerText: '매출일자',
      width: 100,
    },
    // {
    //   dataField: 'salesDate',
    //   headerText: '날짜',
    //   width: '8%',
    //   minWidth: 100,
    //   style: 'text-center',
    // },
    {
      dataField: 'transaction_count',
      headerText: '결제 건수',
      width: 100,
    },

    {
      dataField: 'cancel_count',
      headerText: '취소건수',
      width: 100,
    },

    // {
    //   dataField: '',
    //   headerText: '환불 건수',
    //   style: 'text-center',
    //   width: '8%',
    //   minWidth: 100,
    // },

    {
      dataField: 'totalSalesAmountChargerRecordTb',
      headerText: '정산대상 매출액',
      style: 'text-center',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    {
      dataField: 'totalCancelAmountChargerRecordTb',
      headerText: '총 환불 금액',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    {
      dataField: 'totalCommissionAmountChargerRecordTb',
      headerText: '총 수수료',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    {
      dataField: 'sum_sales_amount_cancel_amount_commission_amount',
      headerText: '지급대상금액',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        // const dataFormated =
        //   Number(_item?.total_amount) - Number(_item?.total_commission);
        // const priceFormated =
        //   new Intl.NumberFormat('en-US').format(dataFormated) + '원';
        // return priceFormated;
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    {
      dataField: 'total_kwh',
      headerText: '총 충전량 (kWh)',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'total_kwh_minus_ignore_kwh',
      headerText: '실제 충전량 (kWh)',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'ignore_kwh',
      headerText: '충전판매손실',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'totalCountPG',
      headerText: 'PG 정산 결과',
      width: 100,
      // renderer: {
      //   type: IGrid.RendererKind.IconRenderer,
      //   iconWidth: 18,
      //   iconHeight: 18,
      //   iconTableRef: {
      //     default: './assets/img/icon/icon-edit.png',
      //   },
      //   onClick: function (event) {
      //     // setIsEditOpen(true);
      //     setModalPGData(event?.item?.salesDate);
      //   },
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
            if (event.dataField === 'totalCountPG')
              setModalPGData(event?.item?.salesDate);
          },
        );
        return `<div style="display:flex;justify-content:center">${
          value as number
        }</div>`;
      },
    },
    {
      dataField: 'totalCountERP',
      headerText: 'ERP전송결과',
      style: 'text-center',
      width: 100,

      // renderer: {
      //   type: IGrid.RendererKind.IconRenderer,
      //   iconWidth: 18,
      //   iconHeight: 18,
      //   iconTableRef: {
      //     default: './assets/img/icon/icon-edit.png',
      //   },
      //   onClick: function (event) {
      //     // setIsEditOpen(true);
      //     setModalERPData(event?.item?.salesDate);
      //   },
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
            // console.log(event);
            if (event.dataField === 'totalCountERP')
              setModalERPData(event?.item?.salesDate);
          },
        );
        return `<div style="display:flex;justify-content:center">${
          value as number
        }</div>`;
      },
    },
    {
      dataField: 'edit',
      headerText: '상세보기',
      width: 100,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '상세',
        onClick: function (event) {
          // setIsEditOpen(true);
          const url = `/settlement/${event?.item?.sales_date as string}`;
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
    const url = `/settlement?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&content=${queryState.content}&division=${queryState.division}`;

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
        (event: IGrid.CellDoubleClickEvent) => {
          setSettlementData(event.item);
        },
      );
      // 그리드 수직스크롤 이벤트 바인딩
      // grid.bind(
      //   IGrid.EventKind.VScrollChange,
      //   (event: IGrid.VScrollChangeEvent) => {
      //     const rowCount = grid.getRowCount();
      //     if (rowCount === totalCount) {
      //       grid.unbind(IGrid.EventKind.VScrollChange);
      //       return;
      //     }
      //     if (event.position === event.maxPosition) {
      //       void requestAddData();
      //     }
      //   },
      // );
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

      // const datafake = [];
      // for (let i = 30; i > 0; i--) {
      //   datafake.push({
      //     d1: i,
      //     d2: '2023-09-10',
      //     d3: '11,132',
      //     d4: '1,300',
      //     d5: '12',
      //     d6: '5,800,000',
      //     d7: '180,000',
      //     d8: '5,800',
      //     d9: '12',
      //     d10: '130',
      //     d11: '4',
      //   });
      // }
      // 그리드 데이터 세팅
      // console.log(datafake);
      grid.setGridData(data3);
    }
  }, [loading, data]);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      settlementIds: checkRowId?.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/settlement/delete-batch`,
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
      <GridButton label="매출 내역" myGrid={myGrid}></GridButton>
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
export default SettlementGrid;
