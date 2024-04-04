import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { DefaultDiv, Spinner } from 'styles/style';
import { OutstandingDetail } from 'components/History/OutstandingPayment/Model/OutstandingDetail';
// import UnexprtedPaymentDetail from '../Model/UnexprtedPaymentDetail';

interface gridInterface {
  loadingOutPay: boolean;
  data: any;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const TableUnExportedPayment = ({
  loadingOutPay,
  data,
  state,
  setState,
}: gridInterface) => {
  const [isOutStandingPaymentOpen, setIsOutStandingPaymentOpen] =
    useState<any>();
  const [itemData, setItemData] = useState<any>();
  const myGrid = useRef<AUIGrid>(null);
  const columnLayout: IGrid.Column[] = [
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
      headerText: '충전 날짜',
      width: '10%',
      minWidth: 160,
    },
    {
      dataField: 'd2',
      headerText: '결제요청일',
    },
    {
      dataField: 'chargerUseLog',
      headerText: '충전소명',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'cl_kwh',
      headerText: '충전량',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedPrice = new Intl.NumberFormat('en-US').format(value);
        return value ? formattedPrice + 'kWh' : '-';
      },
    },
    {
      dataField: 'afterAction',
      headerText: '미결제 금액',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const formattedPrice =
          value === 'COST'
            ? new Intl.NumberFormat('en-US').format(
                _item?.outstandingAmount / 1000,
              ) + '원'
            : null;
        return formattedPrice ?? '-';
      },
    },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 400,
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
  const payTransformData = (data: any[], totalCount: number) => {
    return data.map((item: any) => ({
      ...item,
      totalCount,
    }));
  };

  useEffect(() => {
    if (!loadingOutPay && data !== null) {
      const grid = myGrid.current as AUIGrid;
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});
      // 그리드 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setItemData(event.item);
          setIsOutStandingPaymentOpen(true);
        },
      );
      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.VScrollChangeEvent) => {},
      );
      let data2: any[] = [];
      if (data) {
        data2 = [...payTransformData(data.result, data.totalCount)];
      }
      grid.setGridData(data2);
    }
  }, [data, loadingOutPay]);

  return (
    <DefaultDiv>
      <AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
      <OutstandingDetail
        isOutStandingPaymentOpen={isOutStandingPaymentOpen}
        setIsOutStandingPaymentOpen={setIsOutStandingPaymentOpen}
        setItemData={setItemData}
        itemData={itemData}
        state={state}
        setState={setState}
      />
    </DefaultDiv>
  );
};
export default TableUnExportedPayment;
