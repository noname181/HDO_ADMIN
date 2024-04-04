import { useEffect, useRef } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { GridContainer, GridButton, AUIGridContainer } from 'styles/style';

export const UnexportedPaymentGridTable = () => {
  const payHisGrid = useRef<AUIGrid>(null);
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'd99',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'd1',
      headerText: '부문',
      style: 'text-center',
    },
    {
      dataField: 'd2',
      headerText: '지사',
      style: 'text-center',
    },
    {
      dataField: 'd3',
      headerText: '구분',
      style: 'text-center',
    },
    {
      dataField: 'd4',
      headerText: '운영',
      style: 'text-center',
    },
    {
      dataField: 'd5',
      headerText: '충전소 ID',
      style: 'text-center',
    },
    {
      dataField: 'd6',
      headerText: '충전소명',
      style: 'text-center',
    },
    {
      dataField: 'd7',
      headerText: '충전기 ID',
      style: 'text-center',
    },
    {
      dataField: 'd8',
      headerText: '속도',
      style: 'text-center',
    },
    {
      dataField: 'd9',
      headerText: '인증방법',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'd10',
      headerText: '충전 ID',
      style: 'text-center',
    },
    {
      dataField: 'd11',
      headerText: '유저 ID',
      style: 'text-center',
    },
    {
      dataField: 'd12',
      headerText: '이름',
      style: 'text-center',
    },
    {
      dataField: 'd13',
      headerText: '전화번호',
      style: 'text-center',
    },
    {
      dataField: 'd14',
      headerText: '차량번호',
      style: 'text-center',
    },
    {
      dataField: 'd15',
      headerText: '미출차',
      style: 'text-center',
    },
    {
      dataField: 'd16',
      headerText: '결제금액',
      style: 'text-center',
    },
    {
      dataField: 'd17',
      headerText: '결제 상태',
      style: 'text-center',
    },
    {
      dataField: 'd18',
      headerText: '결제 방법',
      style: 'text-center',
    },
    {
      dataField: 'd19',
      headerText: '결제 시간',
      style: 'text-center',

      width: '6%',
      minWidth: 100,
    },
    // {
    //   dataField: 'd20',
    //   headerText: '차량번호',
    //   minWidth: 50,
    // },
    // {
    //   dataField: 'd21',
    //   headerText: '차량번호',
    //   // width: 'auto',
    //   // style: 'text-left',
    //   minWidth: 50,
    // },
    // {
    //   dataField: 'd22',
    //   headerText: '결제금액',
    //   minWidth: 50,

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },

    // {
    //   dataField: 'd23',
    //   headerText: '결제시간',
    //   width: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     const formattedValue = dayjs(value).format('YYYY-MM-DD');
    //     return formattedValue;
    //   },
    // },
    {
      dataField: 'edit',
      headerText:
        '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
      width: '4%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.IconRenderer,
        iconWidth: 18,
        iconHeight: 18,
        iconTableRef: {
          default: './assets/img/icon/icon-edit.png',
        },
        onClick: function (event) {
          // setIsModalOpen(true);
        },
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
      },
    );

    // 그리드 수직스크롤 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.VScrollChange,
      (event: IGrid.VScrollChangeEvent) => {
        // console.log(event);
      },
    );
    // fake data
    const data = [];

    for (let i = 50; i > 10; i--) {
      data.push({
        d99: i,
        d1: '중부',
        d2: '서울',
        d3: '직영',
        d4: '운영',
        d5: '53030002',
        d6: '등촌주유소',
        d7: '1011-등촌',
        d8: '200kw',
        d9: 'QR인증',
        d10: 'AAA',
        d11: 'peter1',
        d12: '02-1234-1234',
        d13: '010-1111-2222',
        d14: '12가1234',
        d15: '미이동',
        d16: '12,000원',
        d17: '결제완료',
        d18: '카드',
        d19: '2023-10-10',
        d20: '12가1234',
        d21: '12가1234',
        d22: '12,000원',
        d23: '2023-10-10',
      });
    }

    // 그리드 데이터 세팅
    grid.setGridData(data);
  }, []);

  return (
    <GridContainer height="calc(100vh - 19rem)">
      <GridButton label="미출차 결제 내역" myGrid={payHisGrid}></GridButton>
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={payHisGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
export default UnexportedPaymentGridTable;
