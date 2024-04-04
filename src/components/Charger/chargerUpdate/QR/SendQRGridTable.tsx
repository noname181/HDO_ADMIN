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
  setSendId: any;
  sendId: any;
}
export const SendQRGridTable = ({
  loading,
  data,
  setSendId,
  totalCount,
  queryState,
  setQueryState,
  sendId,
}: Props) => {
  const context = useContext(TabsContext);
  //   const setAlertModalState = useSetRecoilState(alertModalState);
  //   const checkBoxDisabled = () => {
  //     setAlertModalState((prev) => ({
  //       ...prev,
  //       open: true,
  //       content: '해당 충전기는 선택이 불가합니다.',
  //     }));
  //   };
  const SendQRGrid = useRef<AUIGrid>(null);
  const [{ user }] = useRecoilState(userAuthState);
  const grid = SendQRGrid.current as AUIGrid;
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
    // {
    //   dataField: 'chg_id',
    //   headerText: '충전 ID',
    //   width: '8%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'chargingStation',
      headerText: '부문',
      width: '8%',
      minWidth: 100,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return _item?.chargingStation?.org?.category === 'EV_DIV'
          ? 'EV사업부'
          : value?.org?.areaName;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '지사',
      width: '8%',
      minWidth: 100,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return _item?.chargingStation?.org?.category === 'EV_DIV'
          ? 'EV사업부'
          : value?.org?.branchName;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '구분',
      width: '8%',
      minWidth: 100,
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
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_station_id ?? '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소명',
      width: '8%',
      minWidth: 100,
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
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'chargerModel',
      headerText: '모델명',
      width: '8%',
      minWidth: 100,
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
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
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
      width: '8%',
      minWidth: 100,
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
    // {
    //   dataField: '',
    //   headerText: '적용버전',
    //   width: '8%',
    //   minWidth: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    // {
    //   dataField: '',
    //   headerText: '최신버전',
    //   width: '8%',
    //   minWidth: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'qrTransDate',
      headerText: 'QR전송일',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    // {
    //   dataField: 'chargerModelId',
    //   headerText: '모델 아이디',
    //   visible: false,
    //   style: 'text-left',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },

    // {
    //   dataField: '',
    //   headerText: '업데이트 일자',
    //   width: '8%',
    //   minWidth: 100,
    //   style: 'text-center',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
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
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
    rowCheckDisabledFunction: function (_rowIndex, _isChecked, item) {
      // console.log(item?.chargerStates);
      if (
        item.chg_use_yn === 'N'
        // ||
        // item.chargerStates?.cs_charger_state === '2' ||
        // item.chargerStates?.cs_charger_state === '3' ||
        // item.chargerStates?.cs_charger_state === '6'
        // || item.chargingStation?.chgs_name === '등촌주유소 충전소1'
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

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = SendQRGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charger-update/qr?rpp=${queryState?.rpp}&page=${queryState?.page}&odby=${queryState?.odby}&searchKey=${queryState?.searchKey}&searchVal=${queryState?.searchVal}&startDate=${queryState?.startDate}&endDate=${queryState?.endDate}&update=${queryState?.update}`;

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
          (event: IGrid.RowAllChkClickEvent) => {
            setSendId([]);
            if (event.checked) {
              if (event.checked) {
                const dataItems = grid?.getGridData() as Array<{
                  chg_id: number;
                  chg_use_yn: string;
                }>;
                // console.log(dataItems);

                const filteredIds = dataItems
                  .filter((item) => item?.chg_use_yn !== 'N')
                  .map((item) => item?.chg_id);

                setSendId(filteredIds);
              } else {
                setSendId([]);
              }
            }
          },
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (context.selectedIndex === '1') {
      const grid = SendQRGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);
  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          const clickedId: number = event.item.chg_id;
          setSendId((prev: any) => {
            if (prev.includes(clickedId)) {
              return prev.filter((id: any) => id !== clickedId);
            } else {
              return [...prev, clickedId];
            }
          });
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
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          setSendId([]);
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

              setSendId(filteredIds);
            } else {
              setSendId([]);
            }
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

  // useEffect(() => {
  //   console.log(sendId);
  // }, [sendId]);
  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton
        label="충전기 목록"
        myGrid={SendQRGrid}
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
          ref={SendQRGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
