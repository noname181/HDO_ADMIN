import { useEffect, useRef, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { category, handCarWash } from 'utils/stationUtils';
import { closed } from 'utils/test/FilterSwitch';
import { type UpdateStateInterface } from 'interfaces/ICommon';
import { areaText, branchText } from 'utils/codelookup';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: UpdateStateInterface;
  setState: React.Dispatch<React.SetStateAction<UpdateStateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}
const PointHistoryGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
}: StationGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

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
        return value - _rowIndex;
      },
    },
    {
      dataField: 'bookingId',
      headerText: '주문ID',
      width: 180,
      style: 'text-center',
    },
    {
      dataField: 'user',
      headerText: '회원번호',
      style: 'text-center',

      labelFunction(rowIndex, columnIndex, value) {
        return value.accountId;
      },
    },
    {
      dataField: 'user',
      headerText: '사용자명',
      style: 'text-center',

      labelFunction(rowIndex, columnIndex, value) {
        return value.name;
      },
    },
    {
      dataField: 'pointType',
      headerText: '포인트',
      style: 'text-center',

      // renderer: {
      //   type: IGrid.RendererKind.TemplateRenderer,
      //   aliasFunction: function (
      //     rowIndex,
      //     columnIndex,
      //     value,
      //     headerText,
      //     item,
      //   ) {
      //     // Value processing function when exporting Excel, PDF, etc.
      //     return value;
      //   },
      // },
      // labelFunction(rowIndex, columnIndex, value) {
      //   if (value.type === 'earn') {
      //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //     return `<div style="color:#03A56B;">+${value}</div>`;
      //   } else {
      //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //     return `<div style="color:#0582DC;">- ${value} </div>`;
      //   }
      // },
    },
    {
      dataField: 'createdBy',
      headerText: '회원명',
      style: 'text-center',

      labelFunction(rowIndex, columnIndex, value) {
        return value.name;
      },
    },
    {
      dataField: 'useYN',
      headerText: '사용여부',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return 'Y';
        }
        return 'N';
      },
    },
    {
      dataField: 'd9',
      headerText: '구분',
      style: 'text-center',
    },
    {
      dataField: 'd10',
      headerText: '사용처',
      style: 'text-center',
    },
    {
      dataField: 'point',
      headerText: '차감 포인트',
      style: 'text-center',
    },
    {
      dataField: 'd12',
      headerText: '잔여 포인트',
      style: 'text-center',
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
      width: 100,
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/point?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}`;

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
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      grid.setGridData(data3);
    }
  }, [loading, data]);

  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton label="포인트" myGrid={myGrid}></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
export default PointHistoryGridTable;
