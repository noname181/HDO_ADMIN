import { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import dayjs from 'dayjs';

interface ConfigLogGridTableProps {
  loading: boolean;
  data: any;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}
export const ConfigLogGrid = ({
  loading,
  data,
  totalCount,
  queryState,
  setQueryState,
}: ConfigLogGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    rowIdField: 'id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
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
    // showRowCheckColumn: true,
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/admin/logs/cloudwatch?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startTime=${queryState.startDate}&endTime=${queryState.endDate}`;
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
      dataField: 'createdAt',
      headerText: 'createdAt',
      width: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD h:mm:ss');
        return formattedValue;
      },
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
      //   const stringValue =
      //     typeof value === 'number' ? value.toString() : value;
      //   const year = stringValue.slice(0, 4);
      //   const month = stringValue.slice(5, 6).padStart(2, '0');
      //   const day = stringValue.slice(8, 9).padStart(2, '0');
      //   const formattedString = `${String(year)}-${String(month)}-${String(
      //     day,
      //   )}`;

      //   return formattedString;
      // },
    },
    {
      dataField: 'data',
      headerText: 'log',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.log ?? '-';
      },
    },
    {
      dataField: 'data',
      headerText: 'container_name',
      width: '8%',
      minWidth: 120,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.kubernetes?.container_name ?? '-';
      },
    },
    {
      dataField: 'data',
      headerText: 'host',
      width: '21%',
      minWidth: 340,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.kubernetes?.host ?? '-';
      },
    },
  ];

  // 그리드 이벤트 세팅
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      // console.log(data);
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
      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      const datafake = [];

      for (let i = 15; i > 0; i--) {
        datafake.push({
          d1: i,
          d2: '2023.11.01 11:11:00',
          d3: 'HDO 회원',
          d4: '성공',
        });
      }
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);

  return (
    <>
      <GridButton label="콘솔로그" myGrid={myGrid}></GridButton>
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
export default ConfigLogGrid;
