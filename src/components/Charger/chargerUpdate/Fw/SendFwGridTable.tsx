import {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import {
  GridContainer,
  AUIGridContainer,
  Spinner,
  GridButton,
} from 'styles/style';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type FWInterface } from 'interfaces/IChgUpdate';
import { category } from 'utils/stationUtils';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { chargerState } from 'utils/test/FilterSwitch';
import { areaText, branchText } from 'utils/codelookup';
import { TabsContext } from 'components/common/Tab/Tabs';
import { hdoInstance } from 'apis/hdoInstance';
import { Button } from 'components/common/Button/Button';
import { userAuthState } from 'recoil/authState';
import ClauseTransmissionHistory from './Model/ClauseTransmissionHistory';

interface FWAUIGridProps {
  loading: boolean;
  data: FWInterface[] | null;
  refetch: () => void;
  sendId: number[] | string[];
  setSendId: Dispatch<SetStateAction<number[] | string[]>>;
  latestVer: string;
  totalCount: number | null;
  queryState: any;
  setQueryState: Dispatch<SetStateAction<any>>;
}

export const SendFwGridTable = ({
  loading,
  data,
  sendId,
  setSendId,
  latestVer,
  totalCount,
  queryState,
  setQueryState,
}: FWAUIGridProps) => {
  const context = useContext(TabsContext);
  const [{ user }] = useRecoilState(userAuthState);
  const [openDetailModel, setOpenDetailModel] = useState<boolean>(false);
  const [termsId, setTermsId] = useState<number | ''>('');

  const setAlertModalState = useSetRecoilState(alertModalState);
  const checkBoxDisabled = () => {
    setAlertModalState((prev) => ({
      ...prev,
      open: true,
      content: '해당 충전기는 선택이 불가합니다.',
    }));
  };
  const isEnableCheck = (item: any) => {
    if (item.chg_use_yn === 'N') {
      return false;
    }
    if (item?.chargerStates?.length > 0) {
      if (
        item?.chargerStates[0]?.cs_charging_state === 'ready' ||
        item?.chargerStates[0]?.cs_charging_state === 'available'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const chargerGrid = useRef<AUIGrid>(null);
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
      // if (
      //   item.chg_use_yn === 'N' ||
      //   item.state === '2' ||
      //   item.state === '3' ||
      //   item.state === '6'
      // ) {
      //   return false;
      // }
      // return true;
      return isEnableCheck(item);
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
        return value ? value - _rowIndex : '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '부문',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value?.org?.areaName && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value?.org?.areaName;
        }
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '지사',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value?.org?.branchName && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value?.org?.branchName;
        }
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '구분',
      labelFunction(_rowIndex, _columnIndex, value) {
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
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'chg_charger_id',
      headerText: '충전기 ID',
      labelFunction(_rowIndex, _columnIndex, value) {
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
      dataField: 'chargerStates',
      headerText: '상태',
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
      dataField: 'chg_fw_ver',
      headerText: '적용버전',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'chargerModel',
      headerText: '최신버전',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.firmwares?.[0]?.fwVer ?? '-';
      },
    },

    {
      dataField: 'fwTransDate',
      headerText: '업데이트 일자',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
  ];

  // useEffect(() => {
  //   console.log(sendId);
  // }, [sendId]);

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = chargerGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/charger-update/fw?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&update=${queryState.update}&org=${queryState.org}`;

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
    if (context.selectedIndex === '4') {
      const grid = chargerGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);
  const showClauseTransmissionHistory = () => {
    setOpenDetailModel(true);
  };
  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setTermsId(event.item.chg_id);
          showClauseTransmissionHistory();
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          const clickedId: number = event.item.chg_id;
          setSendId((prevIds: any) => {
            if (prevIds.includes(clickedId)) {
              return prevIds.filter((id: any) => id !== clickedId);
            } else {
              return [...prevIds, clickedId];
            }
          });
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
      <ClauseTransmissionHistory
        setOpenDetailModel={setOpenDetailModel}
        openDetailModel={openDetailModel}
        termsId={termsId}
        setTermsId={setTermsId}
      />
    </>
  );
};
