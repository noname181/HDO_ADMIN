import { useEffect, useRef } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
// import dayjs from 'dayjs';

export const ChargerStatusAdminGrid = () => {
  const payHisGrid = useRef<AUIGrid>(null);
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'd1',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'd2',
      headerText: '부문',
      style: 'text-center',
    },
    {
      dataField: 'd3',
      headerText: '지사',
      style: 'text-center',
    },
    {
      dataField: 'd4',
      headerText: '구분',
      style: 'text-center',
    },
    {
      dataField: 'd14',
      headerText: '운영',
      style: 'text-center',
    },
    {
      dataField: 'd5',
      headerText: '충전소 ID',
      style: 'text-center',

      width: 100,
    },

    {
      dataField: 'd6',
      headerText: '충전소 명',
      style: 'text-center',

      width: 150,
    },

    // {
    //   dataField: 'd4',
    //   headerText: '구분',
    // },
    {
      dataField: 'd7',
      headerText: '주소',
      style: 'text-center',

      width: 250,
    },
    {
      dataField: 'd8',
      headerText: '속도',
      style: 'text-center',
    },
    {
      dataField: '',
      headerText: '고장여부',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: '',
      headerText: '미출차',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'd9',
      headerText: '충전기 수량',
      style: 'text-center',
    },
    {
      dataField: 'd10',
      headerText: '일 사용량',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },

    {
      dataField: 'd11',
      headerText: '월 사용량',
      style: 'text-center',
    },
    {
      dataField: 'd12',
      headerText: '일 매출액',
      style: 'text-center',
    },

    {
      dataField: 'd13',
      headerText: '월 매출액',
      style: 'text-center',
    },
    // {
    //   dataField: 'd10',
    //   headerText: '충전량 순',
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
    height: 600,
    fillColumnSizeMode: true, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
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

    for (let i = 20; i > 10; i--) {
      data.push({
        d1: i,
        d2: '중부',
        d3: '대구 북구',
        d4: '직영점',
        d5: '53030002',
        d6: 'SHOP TEST ABC',
        d7: '인천광역시 남동구 백범로 255 (구월동)',
        d8: '200kw',
        d9: '10',
        d10: '30kw',
        d11: '1,234kw',
        d12: '345,678원',
        d13: '345,678원',
        d14: '운영',
      });
    }

    // 그리드 데이터 세팅
    grid.setGridData(data);
  }, []);

  return (
    <AUIGrid
      ref={payHisGrid}
      columnLayout={columnLayout}
      gridProps={gridProps}
    />
  );
};
