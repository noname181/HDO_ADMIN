/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useRef, useState } from 'react';
import { defaultUrl } from 'apis/api.helpers';

import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';

import ChargingStationRegister from './Model/ChargingStationRegister';
import ChargingStationEdit from './Model/ChargingStationEdit';
import { hdoInstance } from 'apis/hdoInstance';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { category } from 'utils/stationUtils';
import { Button } from 'components/common/Button/Button';

const ChargingStationGridTable = ({
  loading,
  data,
  totalCount,
  queryState,
  setQueryState,
  state,
  setState,
  setCheckRowId,
  checkRowId,
  reload,
}: any) => {
  const [stationId, setStationId] = useState<number | ''>('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const chargingStationGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value;
        }
      },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value;
        }
      },
    },
    {
      dataField: 'category',
      headerText: '구분',
      style: 'text-center',

      // dataField: 'category',
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   function category(item: string) {
      //     switch (item) {
      //       case 'STT_DIR':
      //         return '직영점';
      //       case 'STT_FRN':
      //         return '자영/가맹점';
      //       default:
      //         return '에러';
      //     }
      //   }
      //   return category(value);
      // },
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value);
      },
    },
    {
      dataField: 'status',
      headerText: '운영',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'INACTIVE') {
          return '정지';
        }
        return '운영';
      },
    },
    {
      dataField: 'org',
      headerText: 'ERP 계정정보',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.erp || '-';
      },
    },
    {
      dataField: 'chgs_station_id',
      headerText: '충전소 ID',
      style: 'text-center',
    },
    {
      dataField: 'chgs_name',
      headerText: '충전소명',
      width: '8%',
      minWidth: 180,
      style: 'text-center',
    },
    {
      dataField: 'address',
      headerText: '주소',
      width: '10%',
      minWidth: 250,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'coordinate',
      headerText: '좌표여부',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          if (value?.latitude && value?.longitude) return 'O';
          else return 'X';
        } else return 'X';
      },
    },
    // {
    //   dataField: 'chgs_operator_manager_id',
    //   headerText: '현장담당자',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return '없음';
    //   },
    // },
    // {
    //   dataField: 'chg_charger_id',
    //   headerText: '충전기 ID',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'cntCharger',
      headerText: '충전기 수량',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '0';
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
    // {
    //   dataField: 'maxPower',
    //   headerText: '속도(kW)',
    //   sortable: false,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value;
    //   },
    // },
    // {
    //   dataField: 'lowCnt',
    //   headerText: '완속',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return String(value) + '대' ?? '-';
    //   },
    // },
    // {
    //   dataField: 'hyperCnt',
    //   headerText: '급속',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return String(value) + '대' ?? '-';
    //   },
    // },
    // {
    //   dataField: 'chgs_car_wash_yn',
    //   headerText: '세차장',
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     if (value === 'Y') {
    //       return '있음';
    //     }
    //     return '없음';
    //   },
    // },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
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
    //       setStationId(event.item.chgs_id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    height: '100%',
    width: '100%',
    enableSorting: false,
    enableColumnResize: false,
    fillColumnSizeMode: true, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    // showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
    showRowCheckColumn: true,
    rowCheckDisabledFunction: function (_rowIndex, _isChecked, item) {
      return isEnableCheck(item);
    },
  };
  const isEnableCheck = (item: any) => {
    if (item?.org?.category !== 'EV_DIV') {
      return false;
    } else {
      return true;
    }
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = chargingStationGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charging-stations-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&area=${queryState.area}&branch=${queryState.branch}&org=${queryState.org}&status=${queryState.status}&wash=${queryState.wash}&region=${queryState.region}`;

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
      const grid = chargingStationGrid.current as AUIGrid;
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setStationId(event.item.chgs_id);
        },
      );
      // 그리드 셀클릭 이벤트 바인딩
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
      // grid.bind(
      //   IGrid.EventKind.CellDoubleClick,
      //   (event: IGrid.CellDoubleClickEvent) => {
      //     setStationId(event.item.chgs_id);
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
            requestAddData();
          }
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.chgs_id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.chgs_id,
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
            const dataItems = grid?.getGridData() as Array<{ chgs_id: number }>;
            setCheckRowId(dataItems.map((item) => item.chgs_id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      // 그리드 데이터 세팅
    }
  }, [loading, data]);

  useEffect(() => {
    if (data !== null) {
      const grid = chargingStationGrid.current as AUIGrid;

      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));

      setTimeout(() => {
        grid.setGridData(data3);
      }, 300);
    }
  }, [data]);
  // console.log(data);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      ids: checkRowId,
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/charge-stations`,
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
  useEffect(() => {
    if (state.isSuccess) {
      setCheckRowId([]);
    }
  }, [state]);
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }

  return (
    <GridContainer height="calc(100vh - 18.8rem)">
      <GridButton
        label="충전소 목록"
        myGrid={chargingStationGrid}
        // onDelete={handleDeleteRow}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          [직영 충전소 등록 안내] 1. SAP 충전소 정보 등록 -&gt; 2. KICC
          온·오프라인 Mall ID 요청 -&gt; 3. EV&U 충전소 정보 확인 및 추가 정보
          기입
        </span>
        <Button
          size="md"
          color="reset"
          icon="/assets/img/icon/icon-trash.png"
          alt="비활성"
          onClick={() => {
            handleDeleteRow();
          }}
        >
          삭제
        </Button>
        <ChargingStationRegister state={state} setState={setState} />
      </GridButton>
      {loading && <Spinner />}
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={chargingStationGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ChargingStationEdit
        state={state}
        setState={setState}
        stationId={stationId}
        setStationId={setStationId}
        reload={reload}
      />
    </GridContainer>
  );
};

export default ChargingStationGridTable;
