import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { type StateInterface } from 'interfaces/ICommon';
import CarWashEdit from './Model/CarWashEdit';
import { GridContainer, GridButton, AUIGridContainer } from 'styles/style';
import { type CarWashFilterInterface } from 'interfaces/IFilter';
import { hdoInstance } from 'apis/hdoInstance';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  queryState: CarWashFilterInterface;
  setQueryState: React.Dispatch<React.SetStateAction<CarWashFilterInterface>>;
  totalCount: number | null;
}
export const CarWashGridTable = ({
  loading,
  data,
  state,
  setState,
  queryState,
  setQueryState,
  totalCount,
}: StationGridTableProps) => {
  const payHisGrid = useRef<AUIGrid>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carWashID, setCarWashID] = useState<number | ''>('');
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'id',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
    },
    {
      dataField: 'car_number',
      headerText: '차량번호',
      style: 'text-center',
    },
    {
      dataField: 'coupon_count',
      headerText: '쿠폰/티켓 수량',
      style: 'text-center',
    },
    {
      dataField: 'price',
      headerText: '가격',
      style: 'text-center',
    },
    {
      dataField: 'purchase_date',
      headerText: '구입일자',
      width: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
    },
    {
      dataField: 'address',
      headerText: '주소',
      style: 'text-center',
    },
    {
      dataField: 'date_use',
      headerText: '사용일자',
      style: 'text-center',

      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
    },
    {
      dataField: 'member_name',
      headerText: '회원명',
      style: 'text-center',
    },
    {
      dataField: 'is_used_service',
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
      dataField: 'assignment',
      headerText: '구분',
      style: 'text-center',
    },
    {
      dataField: 'use_where',
      headerText: '사용처',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
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
          setIsModalOpen(true);
          setCarWashID(event.item.id);
        },
      },
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

  useEffect(() => {
    if (!loading && data !== null) {
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
      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = payHisGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/car-wash?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&car_number=${queryState.car_number}`;

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
  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton label="세차권" myGrid={payHisGrid}></GridButton>
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={payHisGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>

      <CarWashEdit
        state={state}
        setState={setState}
        carWashID={carWashID}
        setCarWashID={setCarWashID}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </GridContainer>
  );
};
