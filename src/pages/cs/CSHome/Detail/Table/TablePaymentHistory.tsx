import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { DefaultDiv, Spinner } from 'styles/style';
import { type subGridInterface } from 'interfaces/IConsultant';
import ConsultantPayHistoryModel from '../../Model/ConsultantPayHistoryModel';

interface gridInterface {
  state: subGridInterface;
  setState: React.Dispatch<React.SetStateAction<subGridInterface>>;
  payData: any;
}

interface payDataInput {
  createdAt: string;
  card_no: string;
  acquirer_nm: string;
  amount: string;
  chargingLogs: any;
  chargingStationUseLog: any;
  pg_cno: string;
  stat_msg: string;
  totalCount: number | null;
}

const TablePaymentHistory = ({ state, setState, payData }: gridInterface) => {
  const myGrid2 = useRef<AUIGrid>(null);
  const [payHisData, setPayHisData] = useState<any>();
  const [isConsultantPayHistory, setIsConsultantPayHistory] =
    useState<boolean>();

  const payTransformData = (data: payDataInput[], totalCount: number) => {
    return data.map((item: any) => ({
      ...item,
      totalCount,
    }));
  };

  useEffect(() => {
    setPayHisData(payData);
  }, [payData]);
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '5%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex ?? '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '결제일',
      width: '10%',
      minWidth: 160,

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'sb_charger_memb',
      headerText: '충전소명',
      width: '15%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'card_no',
      headerText: '카드번호',
      width: '15%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'issuer_nm',
      headerText: '카드사',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'totalPayment',
      headerText: '총 결제금액',
      width: '20%',
      minWidth: 100,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value;
      // },
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    {
      dataField: 'paymentState',
      headerText: '결제 상태',
      width: '10%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.[0]?.res_msg ?? '-';
      },
    },
    {
      dataField: 'pg_cno',
      headerText: '승인번호',
      width: '10%',
      minWidth: 150,
      visible: false,
    },

    // {
    //   dataField: 'return',
    //   headerText: '환불',
    //   renderer: {
    //     type: IGrid.RendererKind.ButtonRenderer,
    //     labelText: '환불 요청',
    //     onClick: function (event) {
    //       returnAction(event);
    //     },
    //   },
    // },
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
    //       setPayHisData(event.item);
    //       setIsConsultantPayHistory(true);
    //     },
    //   },
    // },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 360,
    fillColumnSizeMode: false, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    enableColumnResize: false, // 칼럼 리사이징 가능 여부를 지정합니다.
    showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };
  useEffect(() => {
    // if (!loading && data !== null) {
    const grid2 = myGrid2.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid2.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});
    // 그리드 셀더블클릭 이벤트 바인딩
    grid2.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {
        setPayHisData(event.item);
        setIsConsultantPayHistory(true);
      },
    );
    // 그리드 수직스크롤 이벤트 바인딩
    grid2.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.VScrollChangeEvent) => {},
    );
    let payData2: any[] = [];

    if (payData) {
      payData2 = [...payTransformData(payData.result, payData.totalCount)];
    }
    grid2.setGridData(payData2);
  }, [payData]);

  return (
    <DefaultDiv>
      <AUIGrid
        ref={myGrid2}
        columnLayout={columnLayout2}
        gridProps={gridProps}
      />
      <ConsultantPayHistoryModel
        state={state}
        setState={setState}
        isConsultantPayHistory={isConsultantPayHistory}
        setIsConsultantPayHistory={setIsConsultantPayHistory}
        payHisData={payHisData}
        setPayHisData={setPayHisData}
      />
    </DefaultDiv>
  );
};
export default TablePaymentHistory;
