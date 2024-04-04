import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import 'AUI/AUIGrid/style.css';

import { ChargerModel } from 'utils/stationUtils';
import { AUIGridContainer } from 'styles/style';
interface ChargingStationAUIGridProps {
  loading: boolean;
  data: any;
  setChargerId: Dispatch<SetStateAction<number | ''>>;
}

export const StationChargerGrid = ({
  loading,
  data,
  setChargerId,
}: ChargingStationAUIGridProps) => {
  const { loadingChargerModelList, ChargerModelInfo } = ChargerModel();
  const stationChargerGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'chg_charger_id',
      headerText: '충전기ID',
      style: 'text-center',
    },
    {
      dataField: 'chg_use_yn',
      headerText: '사용여부',
      style: 'text-center',

      styleFunction(_rowIndex, _columnIndex, value) {
        if (value !== 'Y') {
          return 'red';
        }
        return null;
      },
      labelFunction: (_rowIndex, _columnIndex, value) => {
        switch (value) {
          case 'Y':
            return '사용';
          case 'N':
            return '미사용';
          default:
            return '데이터에러';
        }
      },
    },
    // {
    //   dataField: 'status',
    //   headerText: '상태',
    //   style: 'text-center',
    //   styleFunction(_rowIndex, _columnIndex, value) {
    //     if (value !== 'ACTIVE') {
    //       return 'red';
    //     }
    //     return null;
    //   },
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     switch (value) {
    //       case 'ACTIVE':
    //         return '운영';
    //       case 'INACTIVE':
    //         return '정지';
    //       default:
    //         return '데이터에러';
    //     }
    //   },
    // },
    {
      dataField: 'chargerStates',
      headerText: '충전상태',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value?.[0]?.cs_charging_state) {
          case 'ready':
            return '충전가능';
          case 'available':
            return '충전가능';
          case 'preparing':
            return '준비중';
          case 'charging':
            return '충전중';
          case 'finishing':
            return '종료중';
          case 'offline':
            return '오프라인';
          case 'faulted':
            return '비상정지';
          case 'reserved':
            return '예약중';
          case 'unavailable':
            return '점검중';
          default:
            return '설치중';
        }
      },
    },
    {
      dataField: 'charger_status',
      headerText: '고장여부',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'normal':
            return '정상';
          case 'malfunction':
            return '고장(점검중)';
          default:
            return value ?? '-';
        }
      },
    },
    // {
    //   dataField: 'isJam',
    //   headerText: '고장여부',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     switch (value) {
    //       case 'Y':
    //         return '고장';
    //       case 'N':
    //         return '정상';
    //       default:
    //         return '데이터에러';
    //     }
    //   },
    // },
    {
      dataField: 'chargerModel',
      headerText: '모델명',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.modelName ?? '-';
      },
    },
    {
      dataField: 'chargerModel',
      headerText: '속도(kW)',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.maxKw ?? '-';
      },
    },
    {
      dataField: 'chg_unit_price',
      headerText: '고정단가',
      style: 'text-center',

      // postfix: '원',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? String(value) + '원' : '-';
      },
    },
    // {
    //   dataField: 'UnitPriceSet',
    //   headerText: '단가',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.unitPriceSetName ?? '-';
    //   },
    // },
    // {
    //   dataField: 'reservable',
    //   headerText: '예약기능',
    //   style: 'text-center',

    //   styleFunction(_rowIndex, _columnIndex, value) {
    //     if (value !== 'Y') {
    //       return 'red';
    //     }
    //     return null;
    //   },
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     const item = value.toString();
    //     switch (item) {
    //       case 'Y':
    //         return '가능';
    //       case 'N':
    //         return '불가능';
    //       default:
    //         return '데이터에러';
    //     }
    //   },
    // },
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
    //       setChargerId(event.item.chg_id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    enableColumnResize: false,
    headerHeights: [40],
    enableSorting: false,
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'multipleRows', // singleCell or multipleRows
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = stationChargerGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 그리드 cellClick, headerClick 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setChargerId(event.item.chg_id);
        },
      );
      // console.log(data);
      // 그리드 데이터 세팅
      grid.setGridData(data);
    }
  }, [loading, data]);

  return (
    <AUIGridContainer style={{ height: 300 }}>
      <AUIGrid
        ref={stationChargerGrid}
        columnLayout={columnLayout}
        gridProps={gridProps}
      />
    </AUIGridContainer>
  );
};
