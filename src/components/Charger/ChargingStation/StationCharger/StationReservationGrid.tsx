import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import 'AUI/AUIGrid/style.css';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { ChargerModel } from 'utils/stationUtils';
import { AUIGridContainer, Spinner } from 'styles/style';
import dayjs from 'dayjs';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
interface ChargingStationAUIGridProps {
  loading: boolean;
  data: any;
  totalCount?: number;
  state: any;
  setState: any;
  queryState: any;
  setQueryState: any;
  chargerId?: number | '';
}

export const StationReservationGrid = ({
  loading,
  data,
  totalCount,
  state,
  setState,
  queryState,
  setQueryState,
  chargerId,
}: ChargingStationAUIGridProps) => {
  // const { loadingChargerModelList, ChargerModelInfo } = ChargerModel();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const StationReservationGrid = useRef<AUIGrid>(null);
  async function onDeleteRow(id: number) {
    // console.log(checkRowId);
    const dataToSend = {
      reservationId: id,
    };
    const isConfirmed = window.confirm('예약건을 삭제하시겠습니까?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: String(`/unit-price-reservation/`) + String(id),
          data: dataToSend,
        },
        setState,
      );
    }
  }

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'date',
      headerText: '예약일시',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.slice(0, -3);
      },
    },
    {
      dataField: 'priceOption',
      headerText: '단가',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        const option = value === 'Y' ? '유동단가' : '고정단가';
        return option;
      },
    },
    {
      dataField: '',
      headerText: '단가 설정값',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const dataShow =
          _item?.priceOption === 'Y'
            ? _item?.unitPriceSet?.unitPriceSetName
            : _item?.fixedPrice;
        return dataShow;
      },
    },
    {
      dataField: 'createdBy',
      headerText: '담당자',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const dataShow =
          String(value?.name) + '(' + String(value?.accountId) + ')';
        return dataShow;
      },
    },
    {
      dataField: '',
      headerText: '비고',
      style: 'text-center',
      width: '10%',
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '삭제',
        onClick: function (event) {
          void onDeleteRow(event?.item?.id);
        },
      },
    },
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
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = StationReservationGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/unit-price-reservation?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&chargerId=${chargerId}`;

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
      const grid = StationReservationGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 그리드 cellClick, headerClick 이벤트 바인딩
      //   grid.bind(
      //     IGrid.EventKind.CellDoubleClick,
      //     (event: IGrid.CellDoubleClickEvent) => {
      //       setChargerId(event.item.chg_id);
      //     },
      //   );
      // console.log(data);
      // 그리드 데이터 세팅
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
        totalCount: totalCount,
      }));
      grid.setGridData(data2);
    }
  }, [loading, data]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <Spinner />}
      <AUIGridContainer style={{ height: 440 }}>
        <AUIGrid
          ref={StationReservationGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </div>
  );
};
