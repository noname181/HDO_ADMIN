import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  GridContainer,
  Spinner,
  AUIGridContainer,
  GridButton,
} from 'styles/style';
import { type StateInterface } from 'interfaces/ICommon';
import dayjs from 'dayjs';
import UnitPriceRegister from './Model/UnitPriceRegister';
import { TableButton } from 'components/common/Button/TableButton';
import UnitPriceEdit from './Model/UnitPriceEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { deleteApi } from 'apis/deleteApi';
import { hdoInstance } from 'apis/hdoInstance';
import { type UnitPriceFilterInterface } from 'interfaces/ICharger';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: UnitPriceFilterInterface;
  setQueryState: React.Dispatch<React.SetStateAction<UnitPriceFilterInterface>>;
}
const UnitPriceGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
}: StationGridTableProps) => {
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [unitPriceID, setUnitPriceID] = useState<number | ''>('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const payHisGrid = useRef<AUIGrid>(null);
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
        return value ? value - _rowIndex : '';
      },
    },
    {
      dataField: 'unitPriceSetName',
      headerText: '단가이름',
      width: 200,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },

    // {
    //   dataField: 'isUsed',
    //   headerText: '사용여부',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     if (value) {
    //       return '사용';
    //     }
    //     return '미사용';
    //   },
    // },
    {
      dataField: 'unitPrice1',
      headerText: '0시~1시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice2',
      headerText: '1시~2시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice3',
      headerText: '2시~3시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice4',
      headerText: '3시~4시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice5',
      headerText: '4시~5시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice6',
      headerText: '5시~6시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice7',
      headerText: '6시~7시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice8',
      headerText: '7시~8시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice9',
      headerText: '8시~9시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice10',
      headerText: '9시~10시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice11',
      headerText: '10시~11시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice12',
      headerText: '11시~12시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice13',
      headerText: '12시~13시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice14',
      headerText: '13시~14시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice15',
      headerText: '14시~15시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice16',
      headerText: '15시~16시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice17',
      headerText: '16시~17시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice18',
      headerText: '17시~18시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice19',
      headerText: '18시~19시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice20',
      headerText: '19시~20시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice21',
      headerText: '20시~21시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice22',
      headerText: '21시~22시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice23',
      headerText: '22시~23시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'unitPrice24',
      headerText: '23시~24시',
      width: '5%',
      minWidth: 72,
      style: 'text-center',
    },
    {
      dataField: 'registerDate',
      headerText: '등록시간',
      width: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = value ? dayjs(value).format('YYYY-MM-DD') : '-';
        return formattedValue;
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
          setIsEditOpen(true);
          setUnitPriceID(event.item.id);
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
    showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows', // singleCell or multipleRows
    rowCheckToRadio: true,
    // 엑스트라 체크박스 체커블 함수
    // 이 함수는 사용자가 체크박스를 클릭 할 때 1번 호출됩니다.
    // rowCheckableFunction: function (rowIndex, isChecked, item) {
    //   // console.log(item);
    //   if (item.status === 'active') {
    //     return false;
    //   }
    //   return true;
    // },
    rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
      if (item.isUsed) {
        return false;
      }
      return true;
    },
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
  }, [data, loading]);

  const handleDelete = async (id: number) => {
    await deleteApi({ url: `/v1/unit-price-set/${id}` }, setState);
  };
  // 체크된 아이템 얻기
  const getCheckedRowItems = () => {
    const grid = payHisGrid.current as AUIGrid;
    const checkedItems = grid.getCheckedRowItems();
    const id = checkedItems[0]?.item?.id;
    const name = checkedItems[0]?.item?.unitPriceSetName;
    if (checkedItems.length <= 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '삭제',
        content: '체크된 항목 없음!!',
      });
      return;
    }
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '삭제',
      content: String(name) + ' 삭제할까요?',
      onOk: () => {
        void handleDelete(id);
        setAlertModal({
          ...alertModal,
          open: false,
        });
      },
    });
    // console.log(checkedItems);
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = payHisGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/unit-price-set?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&unitPriceSetName=${queryState.unitPriceSetName}`;
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
    <>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton
          label="단가테이블"
          myGrid={payHisGrid}
          onDelete={getCheckedRowItems}
        >
          <UnitPriceRegister state={state} setState={setState} />
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={payHisGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>

        <UnitPriceEdit
          state={state}
          setState={setState}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          setUnitPriceID={setUnitPriceID}
          unitPriceID={unitPriceID}
        />
      </GridContainer>
    </>
  );
};
export default UnitPriceGridTable;
