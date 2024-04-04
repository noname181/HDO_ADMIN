import { useEffect, useRef, useContext, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { category } from 'utils/stationUtils';
import { areaText, branchText } from 'utils/codelookup';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

import { defaultUrl } from 'apis/api.helpers';
import dayjs from 'dayjs';
// import { TabsContext } from 'components/common/Tab/Tabs';
import { ChargerEdit } from './ChargerEdit';
import { hdoInstance } from 'apis/hdoInstance';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { Button } from 'components/common/Button/Button';

const ChargerGridTable = ({
  state,
  setState,
  loading,
  data,
  refetch,
  totalCount,
  queryState,
  setQueryState,
  reload,
}: any) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // const context = useContext(TabsContext);
  const [chargerId, setChargerId] = useState('');
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  // 그리드 객체
  const chargerGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '부문',
      sortable: false,
      style: 'text-center',

      // labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
      //   return item?.chargingStation?.org?.category === 'EV_DIV'
      //     ? 'EV사업부'
      //     : value?.org?.areaName;
      // },
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value?.org?.areaName;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '지사',
      sortable: false,
      style: 'text-center',

      // labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
      //   return item?.chargingStation?.org?.category === 'EV_DIV'
      //     ? 'EV사업부'
      //     : value?.org?.branchName;
      // },
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value?.org?.branchName;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '구분',
      sortable: false,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value?.org?.category);
      },
    },

    // {
    //   dataField: '',
    //   headerText: '사용',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
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
      headerText: '운영상태',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'normal':
            return '정상';
          case 'malfunction':
            return '고장(점검중)';
          // case 'installing':
          //   return '설치중';
          // case 'offline':
          //   return '사용중지';
          default:
            return '알수없음';
        }
      },
    },
    {
      dataField: 'chargingStation',
      headerText: 'ERP 계정정보',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.org?.erp || '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소 ID',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_station_id ?? '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소명',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      sortable: false,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_name;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '주소 ',
      style: 'text-center',
      width: '10%',
      minWidth: 250,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.org?.address ?? '-';
      },
    },
    {
      dataField: 'chg_charger_id',
      headerText: '충전기 ID',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    // {
    //   dataField: 'chg_channel',
    //   headerText: '충전기 수량',
    //   style: 'text-center',
    //   width: '8%',
    //   minWidth: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'chg_use_yn',
      headerText: '사용여부',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'Y':
            return '사용';
          case 'N':
            return '미사용';
          default:
            return '';
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
      sortable: false,
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.modelName;
      },
    },
    // {
    //   dataField: 'status',
    //   headerText: '충전기상태',
    //   sortable: false,
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
      dataField: 'chargerModel',
      headerText: '속도(kW)',
      sortable: false,
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.maxKw;
      },
    },

    // {
    //   dataField: '',
    //   headerText: 'PnC',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    // {
    //   dataField: 'adVersion',
    //   headerText: '광고',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    // {
    //   dataField: 'chg_fw_ver',
    //   headerText: '펌웨어',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'createdAt',
      headerText: '등록일',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
      width: 100,
    },
    {
      dataField: 'cl_datetime',
      headerText: '최근충전일',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? dayjs(value).format('YYYY-MM-DD') : '-';
      },
      width: 100,
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
    //       setChargerId(event.item.chg_id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    rowIdField: 'chg_id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
    fillColumnSizeMode: true,
    enableColumnResize: false,
    headerHeights: [40],
    // enableSorting: false,
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = chargerGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/chargers-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&area=${queryState.area}&branch=${queryState.branch}&org=${queryState.org}&chg_use_yn=${queryState.chg_use_yn}&cs_charging_state=${queryState.cs_charging_state}&charger_status=${queryState.charger_status}&region=${queryState.region}`;

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

  // useEffect(() => {
  //   if (context.selectedIndex === '2') {
  //     const grid = chargerGrid.current as AUIGrid;
  //     grid.resize();
  //   }
  // }, [context.selectedIndex]);

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = chargerGrid.current as AUIGrid;
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setChargerId(event.item.chg_id);
        },
      );
      // let previousColumnIndex: number | null = null;
      // // 그리드 셀클릭 이벤트
      // grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      //   if (previousColumnIndex !== null) {
      //     grid.setColumnProp(previousColumnIndex, { headerStyle: '' });
      //   }
      //   grid.setColumnProp(event.columnIndex, {
      //     headerStyle: 'select-header',
      //   });
      //   previousColumnIndex = event.columnIndex;
      // });
      // 그리드 셀더블클릭 이벤트 바인딩
      // grid.bind(
      //   IGrid.EventKind.CellDoubleClick,
      //   (event: IGrid.CellDoubleClickEvent) => {
      //     // setChargerId(event.item.chg_id);
      //   },
      // );

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
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.chg_id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.chg_id,
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
            const dataItems = grid?.getGridData() as Array<{ chg_id: number }>;
            setCheckRowId(dataItems.map((item) => item.chg_id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      setTimeout(() => {
        grid.setGridData(data3);
      }, 300);
    }
  }, [loading, data]);

  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      chargerManageIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/charger-manage/delete-batch`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     setAlertModal({
        //       ...alertModal,
        //       open: true,
        //       type: 'error',
        //       title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        //       content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        //     });
        //   } else {
        //     setCheckRowId([]);
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
    <GridContainer height="calc(100vh - 22rem)">
      <GridButton
        label="충전기 목록"
        myGrid={chargerGrid}
        onDelete={handleDeleteRow}
        onReload={reload}
      ></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={chargerGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ChargerEdit
        state={state}
        setState={setState}
        chargerId={chargerId}
        setChargerId={setChargerId}
        refetch={refetch}
      />
    </GridContainer>
  );
};

export default ChargerGridTable;
