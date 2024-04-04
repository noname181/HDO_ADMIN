import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { GridContainer, GridButton, AUIGridContainer } from 'styles/style';
import { OutstandingDetail } from './Model/OutstandingDetail';
import { hdoInstance } from 'apis/hdoInstance';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  totalClKwh: number | null;
  totalNotPaid: number | null;
  totalCost: number | null;
}
export const OutstandingPaymentGridTable = ({
  queryState,
  setQueryState,
  loading,
  data,
  state,
  setState,
  totalCount,
  totalClKwh,
  totalNotPaid,
  totalCost,
}: StationGridTableProps) => {
  const payHisGrid = useRef<AUIGrid>(null);
  const [itemData, setItemData] = useState<any>();
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
      dataField: 'cl_id',
      headerText: 'Cl–no',
    },
    {
      dataField: 'createdAt',
      headerText: '충전 일자',
      width: 160,
    },
    // {
    //   dataField: 'd3',
    //   headerText: '결제요청일',
    //   width: 160,
    // },

    {
      dataField: 'chargerUseLog',
      headerText: 'ERP 계정정보',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.org?.erp || '-';
      },
    },
    {
      dataField: 'chargerUseLog',
      headerText: '충전소명',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'chargerUseLog',
      headerText: '충전소 ID',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_station_id ?? '-';
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
      dataField: 'appliedUnitPrice',
      headerText: '적용단가',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedPrice = new Intl.NumberFormat('en-US').format(value);
        return value ? formattedPrice + '원' : '-';
      },
    },
    {
      dataField: 'useType',
      headerText: '인증방법',
    },
    {
      dataField: 'userNew',
      headerText: '회원구분',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.accountId ? '회원' : '비회원';
      },
    },
    {
      dataField: 'expectedAmt',
      headerText: '결제요청금액',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        // const prm = Number(_item?.appliedUnitPrice) * Number(_item?.cl_kwh);
        // const formattedPrice = prm
        //   ? new Intl.NumberFormat('en-US').format(prm) + '원'
        //   : null;
        // return formattedPrice ?? '-';
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0원';
      },
    },
    {
      dataField: 'payCompletedYn',
      headerText: '미결제 금액',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const formattedPrice =
          value === 'N'
            ? new Intl.NumberFormat('en-US').format(_item?.expectedAmt) + '원'
            : null;
        return formattedPrice ?? '0원';
      },
    },
    {
      dataField: 'afterAction',
      headerText: '잡손실 처리',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const formattedPrice =
          value === 'COST'
            ? new Intl.NumberFormat('en-US').format(_item?.expectedAmt) + '원'
            : null;
        return formattedPrice ?? '0원';
      },
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = payHisGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `v1/payment/outstanding?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`;

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
      });
  };

  useEffect(() => {
    // if (!loading && data !== null) {
    const grid = payHisGrid.current as AUIGrid;

    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });

    // 그리드 셀클릭 이벤트 바인딩
    // TODO 흠.. 헤더쪽 스타일은 cellClick 이후에 실행되어서 한박자 느리게 보임
    let previousColumnIndex: number | null = null;
    grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      if (previousColumnIndex !== null) {
        grid.setColumnProp(previousColumnIndex, { headerStyle: '' });
      }
      grid.setColumnProp(event.columnIndex, {
        headerStyle: 'select-header',
      });
      previousColumnIndex = event.columnIndex;
    });

    // 그리드 셀더블클릭 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {
        // console.log(event);
        setItemData(event.item);
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
    // fake data
    // const data = [];

    // for (let i = 50; i > 10; i--) {
    //   data.push({
    //     d99: i,
    //     d1: '1235',
    //     d2: '2023.10.11 10:52:32',
    //     d3: '2023.10.11 10:52:32',
    //     d4: '강남셀프주유소',
    //     d5: '123',
    //     d6: '12.00',
    //     d7: '345.6',
    //     d8: '후불결제',
    //     d9: '법인회원',
    //     d10: '41,472',
    //   });
    // }

    const data2 = data?.map((item: any) => ({
      ...item,
      totalCount,
    }));

    // console.log(data);
    // 그리드 데이터 세팅
    grid.setGridData(data2);
  }, [loading, data]);

  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton label="발송 내역" myGrid={payHisGrid}>
        <div
          style={{
            display: 'flex',
            marginRight: '50px',
          }}
        >
          <div style={{ marginLeft: '50px' }}>
            충전량 : {new Intl.NumberFormat('en-US').format(totalClKwh ?? 0)}
            kWh
          </div>
          <div style={{ marginLeft: '50px' }}>
            미결제 금액:{' '}
            {new Intl.NumberFormat('en-US').format(totalNotPaid ?? 0)} (원)
          </div>
          <div style={{ marginLeft: '50px' }}>
            잡손실 처리: {new Intl.NumberFormat('en-US').format(totalCost ?? 0)}{' '}
            (원)
          </div>
        </div>
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={payHisGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <OutstandingDetail
        setItemData={setItemData}
        itemData={itemData}
        state={state}
        setState={setState}
      />
    </GridContainer>
  );
};
export default OutstandingPaymentGridTable;
