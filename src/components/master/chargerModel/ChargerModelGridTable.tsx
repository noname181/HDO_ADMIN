import {
  useEffect,
  useRef,
  useState,
  type SetStateAction,
  type Dispatch,
} from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { lastFirmwareVer } from 'utils/test/FilterSwitch';
import { type StateInterface } from 'interfaces/ICommon';
import ChargerModelRegister from './Modal/ChargerModelRegister';
import ChargerModelEdit from './Modal/ChargerModelEdit';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { hdoInstance } from 'apis/hdoInstance';
// interface StationGridTableProps {
//   loading: boolean;
//   data: any;
//   state: UpdateStateInterface;
//   setState: React.Dispatch<React.SetStateAction<UpdateStateInterface>>;
// }
interface ChargerModelInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
  searchKey: string;
  searchVal: string;
  startDate: string;
  endDate: string;
  contype: string;
  speedtype: string;
}
interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: ChargerModelInterface;
  setQueryState: React.Dispatch<React.SetStateAction<ChargerModelInterface>>;
  setCheckRowId: any;
  checkRowId: any;
  reload: () => void;
}

const ChargerModelGridTable = ({
  loading,
  data,
  state,
  setState,
  queryState,
  setQueryState,
  totalCount,
  setCheckRowId,
  checkRowId,
  reload,
}: StationGridTableProps) => {
  const chargerModelGrid = useRef<AUIGrid>(null);
  const [chargerModelData, setChargerModelData] = useState('');
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'manufacturerId',
      headerText: '제조사',
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'manufacturerName',
      headerText: '제조사',
      width: '10%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'id',
      headerText: '모델 ID',
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'modelCode',
      headerText: '모델 ID',
      style: 'text-center',
      width: '15%',
      minWidth: 50,
    },
    {
      dataField: 'modelName',
      headerText: '모델명',
      style: 'text-center',
    },
    {
      dataField: 'connectorType',
      headerText: '커넥터 타입',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'speedType',
      headerText: '충전유형',
      width: '7%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'maxKw',
      headerText: '충전속도 (kW)',
      width: '7%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'channelCount',
      headerText: '채널수',
      width: '5%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'pncAvailable',
      headerText: 'PnC 가능 여부',
      width: '8%',
      minWidth: 50,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return '가능';
        }
        return '불가능';
      },
    },
    {
      dataField: 'useYN',
      headerText: '사용여부',
      width: '6%',
      minWidth: 50,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case true:
            return '사용';
          case false:
            return '미사용';
          default:
            return '';
        }
      },
    },
    {
      dataField: 'lastFirmwareVer',
      headerText: '최신 FW 버전',
      style: 'text-center',
      width: '8%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return lastFirmwareVer(value);
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      style: 'text-center',
      width: '10%',
      minWidth: 50,
    },
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
    //       setChargerModelData(event.item);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    height: '100%',
    width: '100%',
    fillColumnSizeMode: true,
    enableColumnResize: false,
    headerHeights: [40],
    enableSorting: false,
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'singleRow',
    showRowCheckColumn: true,
  };
  const requestAddData = async () => {
    const grid = chargerModelGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charger-model?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&contype=${queryState.contype}&speedtype=${queryState.speedtype}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`;

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
    if (!loading && data !== null) {
      const grid = chargerModelGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.id,
              );
              return newCheckRowId;
            });
          }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          if (event.checked) {
            const dataItems = grid?.getGridData() as Array<{ id: number }>;
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
          // console.log(event);
          const rowCount = grid.getRowCount();
          if (rowCount === totalCount) {
            // console.log(45456);
            grid.unbind(IGrid.EventKind.VScrollChange);
            return;
          }
          if (event.position === event.maxPosition) {
            void requestAddData();
          }
        },
      );
      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setChargerModelData(event.item);
        },
      );

      // 그리드 데이터 세팅
      grid.setGridData(data);
    }
  }, [loading, data]);

  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      chargerIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/chargers/delete-batch`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     alert(error);
        //   }
        // },
      );
    }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }

  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton
        label="충전기 모델"
        myGrid={chargerModelGrid}
        onDelete={handleDeleteRow}
      >
        <ChargerModelRegister state={state} setState={setState} />
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={chargerModelGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ChargerModelEdit
        reload={reload}
        state={state}
        setState={setState}
        chargerModelData={chargerModelData}
        setChargerModelData={setChargerModelData}
      />
    </GridContainer>
  );
};

export default ChargerModelGridTable;
