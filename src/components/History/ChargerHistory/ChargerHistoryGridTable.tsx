import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  GridContainer,
  Spinner,
  GridButton,
  AUIGridContainer,
} from 'styles/style';
// import { category, handCarWash } from 'utils/stationUtils';
// import { closed } from 'utils/test/FilterSwitch';
import { type UpdateStateInterface } from 'interfaces/ICommon';
// import { areaText, branchText } from 'utils/codelookup';
// import dayjs from 'dayjs';
// import ChargerHistoryRegister from './Model/ChargerHistoryRegister';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { category } from 'utils/stationUtils';
import { areaText, branchText } from 'utils/codelookup';
import ChargerHistoryEdit from './Model/ChargerHistoryEdit';
import { OutstandingDetail } from '../OutstandingPayment/Model/OutstandingDetail';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: UpdateStateInterface;
  setState: React.Dispatch<React.SetStateAction<UpdateStateInterface>>;
  totalCount: number | null;
  setQueryState: Dispatch<SetStateAction<any>>;
  queryState: any;
  totalClCharge?: number | null;
  totalClChargeHDO?: number | null;
}
const ChargerHistoryGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  setQueryState,
  queryState,
  totalClCharge,
  totalClChargeHDO,
}: StationGridTableProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isConsultantPayHistory, setIsConsultantPayHistory] =
    useState<boolean>();
  const payHisGrid = useRef<AUIGrid>(null);
  const [payHisData, setPayHisData] = useState<any>();
  const [itemData, setItemData] = useState<any>();
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
      dataField: 'cl_id',
      headerText: 'Cl–no',
    },
    {
      dataField: 'cl_datetime',
      headerText: '충전 일시',
      width: 160,
    },
    {
      dataField: 'chargingStationUseLog',
      headerText: '충전소명',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'chargerUseLog',
      headerText: '충전기 ID',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chg_charger_id ?? '-';
      },
    },
    {
      dataField: 'clCharge',
      headerText: '고객 충전량(kWh)',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },

    {
      dataField: 'clChargeHDO',
      headerText: 'HDO 부담 충전량(kWh)',
      width: 160,
    },
    {
      dataField: 'appliedUnitPrice',
      headerText: '적용단가',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        if (value) {
          const formattedPrice = new Intl.NumberFormat('en-US').format(value);
          return formattedPrice + '원' ?? '-';
        } else return '-';
      },
    },
    {
      dataField: 'totalPayment',
      headerText: '결제 금액',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        if (value) {
          const formattedPrice = new Intl.NumberFormat('en-US').format(value);
          return formattedPrice + '원' ?? '-';
        } else return '-';
      },
    },
    {
      dataField: '',
      headerText: '결제 상태',
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        if (_item.cl_unplug_datetime) {
          if (_item.payCompletedYn === 'N' && _item.useType === 'CREDIT') {
            return '부분취소실패';
          } else if (_item.payCompletedYn === 'N') {
            return '미결제';
          } else if (_item?.afterAction === 'PAID') {
            return '재결제완료';
          } else if (_item?.afterAction === 'COST') {
            return '잡손실처리';
          } else if (_item.total_noti20 > 0) {
            return '환불/취소';
          } else {
            return '결제';
          }
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'tran_date_noti10',
      headerText: '결제 일시',
      width: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'issuer_nm_noti10',
      headerText: '카드사',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'card_no_noti10',
      headerText: '카드번호',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'useType',
      headerText: '회원구분',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'CREDIT' ? '비회원' : '회원';
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
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };
  const requestAddData = async () => {
    const grid = payHisGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/payment/charger-history?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&org=${queryState.division}&isCredit=${queryState.isCredit}&payCompletedYN=${queryState.payCompletedYN}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&startPaymentDate=${queryState.startPaymentDate}&endPaymentDate=${queryState.endPaymentDate}&region=${queryState.region}`;

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
    // if (!loading && data !== null) {
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
        if (event.item?.paymentNotification) {
          setIsConsultantPayHistory(true);
          setPayHisData(event.item);
        } else {
          setItemData(event.item);
        }
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
    // fake data
    // const fdata = [];
    // for (let i = 55; i > 0; i--) {
    //   fdata.push({
    //     isActive: false,
    //     d1: i,
    //     d2: '예약중',
    //     d3: '53030002',
    //     d4: '현대판테온',
    //     d5: '중부',
    //     d6: '대구 북구',
    //     d7: '자영/가맹점',
    //     d8: '200kWh',
    //     d9: '회원',
    //     d10: '예약',
    //     d11: 'QR인증',
    //     d12: '123kw',
    //     d13: '550원',
    //     d14: '23,500원',
    //     d15: '2023-10-10 13:40',
    //     d16: '2023-10-10 13:40',
    //     d17: '2023-10-10 13:40',
    //     d18: '10분',
    //     d19: '2023-10-10 13:40',
    //     d20: '2023-10-10 13:40',
    //     d21: '이동',
    //   });
    // }
    const data2 = data?.map((item: any) => ({
      ...item,
      totalCount,
    }));
    // 그리드 데이터 세팅
    grid.setGridData(data2);
  }, [data, loading]);
  // console.log(data);
  return (
    <GridContainer height="calc(100vh - 22rem)">
      <GridButton label="충전내역" myGrid={payHisGrid}>
        <div
          style={{
            display: 'flex',
            marginRight: '50px',
          }}
        >
          <div style={{ marginLeft: '50px' }}>
            고객 총 충전량 :{' '}
            {new Intl.NumberFormat('en-US').format(totalClCharge ?? 0)} kWh
          </div>
          <div style={{ marginLeft: '50px' }}>
            HDO 부담 총 충전량:{' '}
            {new Intl.NumberFormat('en-US').format(totalClChargeHDO ?? 0)} kWh
          </div>
        </div>
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}

        <AUIGrid
          ref={payHisGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ChargerHistoryEdit
        state={state}
        setState={setState}
        isConsultantPayHistory={isConsultantPayHistory}
        setIsConsultantPayHistory={setIsConsultantPayHistory}
        payHisData={payHisData}
        setPayHisData={setPayHisData}
      />
      <OutstandingDetail
        setItemData={setItemData}
        itemData={itemData}
        state={state}
        setState={setState}
      />
    </GridContainer>
  );
};
export default ChargerHistoryGridTable;
