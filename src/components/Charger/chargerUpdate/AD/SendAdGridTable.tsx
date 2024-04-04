import { useEffect, useRef, useContext, useState } from 'react';
import {
  GridContainer,
  Spinner,
  AUIGridContainer,
  GridButton,
} from 'styles/style';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { category } from 'utils/stationUtils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { chargerState } from 'utils/test/FilterSwitch';
import { areaText, branchText } from 'utils/codelookup';
import { TabsContext } from 'components/common/Tab/Tabs';
import { hdoInstance } from 'apis/hdoInstance';
import { Button } from 'components/common/Button/Button';
import { userAuthState } from 'recoil/authState';
import { AdTransmissionHistory } from './Model/AdTransmissionHistory';
export const SendAdGridTable = ({
  loading,
  data,
  setSendId,
  sendId,
  latestVer,
  totalCount,
  queryState,
  setQueryState,
  setChargerData,
}: any) => {
  const [openDetailModel, setOpenDetailModel] = useState<boolean>(false);
  const [dataId, setDataId] = useState<number | ''>('');
  const context = useContext(TabsContext);
  // const setAlertModalState = useSetRecoilState(alertModalState);
  // const checkBoxDisabled = () => {
  //   setAlertModalState((prev) => ({
  //     ...prev,
  //     open: true,
  //     content: '해당 충전기는 선택이 불가합니다.',
  //   }));
  // };
  const chargerGrid = useRef<AUIGrid>(null);
  const [{ user }] = useRecoilState(userAuthState);
  const grid = chargerGrid.current as AUIGrid;
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: false,
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
    rowCheckDisabledFunction: function (_rowIndex, _isChecked, item) {
      if (
        item.chg_use_yn === 'N'
        //  ||
        // item.chargerState?.cs_charger_state === '2' ||
        // item.chargerState?.cs_charger_state === '3' ||
        // item.chargerState?.cs_charger_state === '6'
      ) {
        return false;
      }
      if (item?.chargerStates?.length > 0) {
        let shouldDisable = false;
        item?.chargerStates.forEach((chargerState: any) => {
          if (
            chargerState?.cs_charger_state === '2' ||
            chargerState?.cs_charger_state === '3' ||
            chargerState?.cs_charger_state === '6'
          ) {
            shouldDisable = true;
          }
        });

        return !shouldDisable;
      }
      return true;
    },
  };

  const columnLayout: IGrid.Column[] = [
    // {
    //   dataField: 'chg_id',
    //   headerText: '충전소 아이디',
    //   visible: false,
    // },
    // {
    //   dataField: 'chg_id',
    //   headerText: '번호',
    //   width: '4%',
    //   minWidth: 50,
    //   style: 'text-center',
    // },
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
      dataField: 'chargingStation',
      headerText: '부문',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.org?.areaName;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '지사',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.org?.branchName;
      },
    },

    {
      dataField: 'chargingStation',
      headerText: '구분',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return category(value?.org?.category);
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소 ID',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_station_id ?? '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소명',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.chgs_name;
      },
    },
    {
      dataField: 'chg_charger_id',
      headerText: '충전기 ID',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value ?? '-';
      },
    },
    {
      dataField: 'chargerModel',
      headerText: '모델명',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.modelName ?? '-';
      },
    },
    {
      dataField: 'chargerModel',
      headerText: '속도(kW)',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.maxKw;
      },
    },
    {
      dataField: 'chg_use_yn',
      headerText: '사용여부',
    },
    // {
    //   dataField: '',
    //   headerText: '유저 ID',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? 'userID';
    //   },
    // },
    // {
    //   dataField: '',
    //   headerText: '이름',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '김철수';
    //   },
    // },
    // {
    //   dataField: '',
    //   headerText: '전화번호',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '010-1234-5678';
    //   },
    // },

    {
      dataField: 'chargingStation',
      headerText: '상태',
      styleFunction(_rowIndex, _columnIndex, value) {
        if (value?.status !== 'ACTIVE') {
          return 'red';
        }
        return null;
      },
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        switch (value?.status) {
          case 'ACTIVE':
            return '운영';
          case 'INACTIVE':
            return '정지';
          default:
            return '데이터에러';
        }
      },
    },
    {
      dataField: 'adVersion',
      headerText: '적용버전',
    },
    {
      dataField: 'latestVer',
      headerText: '최신버전',
    },

    {
      dataField: 'adTransDate',
      headerText: '업데이트 일자',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
  ];

  const requestAddData = async () => {
    const grid = chargerGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charger-update/ad?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}`;

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
    if (data !== null) {
      data.forEach((obj: any) => {
        obj.latestVer = latestVer;
      });
    }
    // console.log(data);
  }, [data]);

  useEffect(() => {
    if (context.selectedIndex === '3') {
      const grid = chargerGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);

  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
        if (sendId !== null) {
          setCheckedRowsByIds();
        }
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setOpenDetailModel(true);
          setDataId(event.item.chg_id);
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setSendId((value: any) => [...value, event.item.chg_id]);
            setChargerData((value: any) => [...value, event.item]);
          } else if (!event.checked) {
            setSendId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.chg_id,
              );
              return newCheckRowId;
            });
            setChargerData((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item.chg_id !== event.item.chg_id,
              );
              return newCheckRowId;
            });
          }
          // const clickedItem: any = event.item;
          // const clickedId: number = event.item.chg_id;
          // setSendId((prevIds: any) => {
          //   if (prevIds.includes(clickedId)) {
          //     return prevIds.filter((id: any) => id !== clickedId);
          //   } else {
          //     return [...prevIds, clickedId];
          //   }
          // });
          // setChargerData((prevIds: any) => {
          //   if (prevIds.includes(clickedItem)) {
          //     return prevIds.filter(
          //       (item: any) => item?.chg_id !== clickedItem?.chg_id,
          //     );
          //   } else {
          //     return [...prevIds, clickedItem];
          //   }
          // });
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          setSendId([]);
          setChargerData([]);
          if (event.checked) {
            // const clickedId = grid.getColumnValues('chg_id');
            // const uncheckedFields = [{ dataField: 'chg_use_yn', value: 'N' }];
            // const uncheckedIds: any = [];
            // uncheckedFields.forEach(({ dataField, value }) => {
            //   grid.addUncheckedRowsByValue(dataField, value);
            //   const fieldValues = grid.getColumnValues(dataField);
            //   fieldValues.forEach((val, index) => {
            //     if (val === value) {
            //       uncheckedIds.push(clickedId[index]);
            //     }
            //   });
            // });
            // const filteredIds = clickedId.filter(
            //   (id) => !uncheckedIds.includes(id),
            // );
            // setSendId(filteredIds);
            if (event.checked) {
              const dataItems = grid?.getGridData() as Array<{
                chg_id: number;
                chg_use_yn: string;
              }>;
              // console.log(dataItems);

              const filteredIds = dataItems
                .filter((item) => item?.chg_use_yn !== 'N')
                .map((item) => item?.chg_id);
              const filteredItems = dataItems
                .filter((item) => item?.chg_use_yn !== 'N')
                .map((item) => item);

              setSendId(filteredIds);
              setChargerData(filteredItems);
            } else {
              setSendId([]);
              setChargerData([]);
            }
          }
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
      // console.log(data2);
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);

  useEffect(() => {
    if (sendId !== null) {
      setCheckedRowsByIds();
    }
  }, [sendId]);
  function setCheckedRowsByIds() {
    const grid = chargerGrid.current as AUIGrid;
    grid.setCheckedRowsByValue('chg_id', sendId);
  }

  return (
    <>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton
          label="충전기 목록"
          myGrid={chargerGrid}
          isExcel={user?.Org.category !== 'CS'}
        >
          <span
            style={{
              display: 'inline-block',
              paddingLeft: '3.5px',
            }}
          >
            * 충전기 중 상태가 충전중, 충전대기 인 충전기에만 전송이 가능합니다.
          </span>
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={chargerGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </GridContainer>
      <AdTransmissionHistory
        setOpenDetailModel={setOpenDetailModel}
        openDetailModel={openDetailModel}
        dataId={dataId}
        setDataId={setDataId}
      />
    </>
  );
};
