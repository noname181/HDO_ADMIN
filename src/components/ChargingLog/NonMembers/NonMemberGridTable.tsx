import { useEffect, useRef, useContext } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { category } from 'utils/stationUtils';
import { chargerState } from 'utils/test/FilterSwitch';
import { areaText, branchText } from 'utils/codelookup';
import {
  GridContainer,
  AUIGridContainer,
  Spinner,
  GridButton,
} from 'styles/style';
import { TabsContext } from 'components/common/Tab/Tabs';
import { hdoInstance } from 'apis/hdoInstance';
import { type UpdateStateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';

interface Props {
  loading: boolean;
  data: any;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}
export const NonMemberGridTable = ({
  loading,
  data,
  totalCount,
  queryState,
  setQueryState,
}: Props) => {
  const context = useContext(TabsContext);
  const myGrid = useRef<AUIGrid>(null);
  const [{ user }] = useRecoilState(userAuthState);
  const grid = myGrid.current as AUIGrid;
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'd1',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      //   labelFunction: function (
      //     _rowIndex,
      //     _columnIndex,
      //     value,
      //     _headerText,
      //     _item,
      //     _dataField,
      //     _cItem,
      //   ) {
      //     return value ? value - _rowIndex : '';
      //   },
    },

    {
      dataField: 'd2',
      headerText: '로그 발생 일자',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd3',
      headerText: '전화번호',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd4',
      headerText: '충전소명',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd5',
      headerText: 'action',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd6',
      headerText: '비고',
      width: '8%',
      minWidth: 100,
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: false,
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    // showRowCheckColumn: true,
    // showRowAllCheckBox: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
  };

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/example/qr?rpp=${queryState?.rpp}&page=${queryState?.page}&odby=${queryState?.odby}&searchKey=${queryState?.searchKey}&searchVal=${queryState?.searchVal}&startDate=${queryState?.startDate}&endDate=${queryState?.endDate}`;

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

        grid.bind(
          IGrid.EventKind.RowAllChkClick,
          (event: IGrid.RowAllChkClickEvent) => {},
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (context.selectedIndex === '1') {
      const grid = myGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);
  useEffect(() => {
    // if (!loading && data !== null) {
    // 그리드 ready 이벤트 바인딩
    grid?.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });
    grid?.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.RowCheckClickEvent) => {
        const clickedId: number = event.item.chg_id;
      },
    );

    // 그리드 수직스크롤 이벤트 바인딩
    grid?.bind(
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
    grid?.bind(
      IGrid.EventKind.RowAllChkClick,
      (event: IGrid.RowAllChkClickEvent) => {},
    );
    const data2 = data?.map((item: any) => ({
      ...item,
      totalCount,
    }));
    // console.log(data2);
    // 그리드 데이터 세팅
    const datafake = [];

    for (let i = 15; i > 0; i--) {
      datafake.push({
        d1: i,
        d2: '2023-11-06 11:00:15',
        d3: '***-****-1234',
        d4: '가양..',
        d5: '취소',
        d6: 'Api 호출 내용',
      });
    }

    grid?.setGridData(datafake);
    // }
  }, [loading, data]);

  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton
        label="로그"
        myGrid={myGrid}
        isExcel={user?.Org.category !== 'CS'}
      ></GridButton>
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
