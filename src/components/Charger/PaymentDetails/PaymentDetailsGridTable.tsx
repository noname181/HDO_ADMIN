/* eslint-disable */
import { useEffect, useRef, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  GridContainer,
  Spinner,
  GridButton,
  AUIGridContainer,
} from 'styles/style';
import { category } from 'utils/stationUtils';
// import { closed } from 'utils/test/FilterSwitch';
import { type UpdateStateInterface } from 'interfaces/ICommon';
import { areaText, branchText } from 'utils/codelookup';
// import dayjs from 'dayjs';
import { hdoInstance } from 'apis/hdoInstance';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import ConsultantPayHistoryModel from 'pages/cs/CSHome/Model/ConsultantPayHistoryModel';

interface PaymentDetailsInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
  member: '' | 'Y' | 'N';
  payType: '' | 'pnc' | 'qr' | '회원카드';
  method: string;
  searchKey: string;
  searchVal: string;
  area: string;
  branch: string;
  category: string;
  startDate: string;
  endDate: string;
}
interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: UpdateStateInterface;
  setState: React.Dispatch<React.SetStateAction<UpdateStateInterface>>;
  totalCount: number | null;
  queryState: PaymentDetailsInterface;
  setQueryState: React.Dispatch<React.SetStateAction<PaymentDetailsInterface>>;
  totalAmount: any;
  totalRefund: any;
}
const PaymentDetailsGridTable = ({
  queryState,
  setQueryState,
  loading,
  data,
  state,
  setState,
  totalCount,
  totalAmount,
  totalRefund,
}: StationGridTableProps) => {
  const payHisGrid = useRef<AUIGrid>(null);
  const [isConsultantPayHistory, setIsConsultantPayHistory] =
    useState<boolean>();
  const [payHisData, setPayHisData] = useState<any>();

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

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
        return value ? value - _rowIndex : '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '결제일',
      width: '8%',
      minWidth: 160,

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },

    {
      dataField: 'noti_type',
      headerText: '결제 상태',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case '10':
            return '결제';
          case '20':
            return '취소';
          default:
            return '-';
        }
      },
    },
    {
      dataField: 'sb_charger_memb',
      headerText: '구분',
      width: '8%',
      minWidth: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value?.chargingStation?.org?.category) ?? '-';
      },
    },
    // {
    //   dataField: '',
    //   headerText: '전화번호',
    //   width: '8%',
    //   minWidth: 160,
    // },
    {
      dataField: 'sb_charger_memb',
      headerText: 'ERP 계정정보',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.org?.erp || '-';
      },
    },
    {
      dataField: 'sb_charger_memb',
      headerText: '충전소명',
      width: '10%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },

    {
      dataField: 'sb_charger_memb',
      headerText: '충전기 ID',
      width: '10%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chg_charger_id ?? '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '충전량',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedPrice = new Intl.NumberFormat('en-US').format(
          value?.cl_kwh,
        );
        return value?.cl_kwh ? formattedPrice + 'kWh' : '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '적용단가',
      width: '8%',
      minWidth: 100,

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        if (value?.appliedUnitPrice) {
          const formattedPrice = new Intl.NumberFormat('en-US').format(
            value?.appliedUnitPrice,
          );
          return formattedPrice + '원' ?? '-';
        } else return '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '인증방법',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.useType ?? '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '회원구분',
      //분류
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.userNew?.accountId ? '회원' : '비회원';
      },
    },
    {
      dataField: 'card_no_noti10',
      headerText: '카드번호',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'issuer_nm_noti10',
      headerText: '카드사',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'amount',
      headerText: '결제 금액',
      width: '8%',
      minWidth: 150,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        // console.log(_item);

        var formattedPrice = 0;
        if (_item?.noti_type === '10') {
          formattedPrice = _item?.amount;
        } else if (_item?.noti_type === '20') {
          formattedPrice = _item?.mgr_amt;
        }
        return new Intl.NumberFormat('en-US').format(formattedPrice);
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
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = payHisGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url =
      `/v1/payment/history/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}&method=${queryState.method}&category=${queryState.category}&member=${queryState.member}&payType=${queryState.payType}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`;

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
          setIsConsultantPayHistory(true);
          setPayHisData(event.item);
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
    <GridContainer height="calc(100vh - 18.825rem)">
      <GridButton label="결제내역" myGrid={payHisGrid}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: '50px',
          }}
        >
          <div>
            결제금액: {new Intl.NumberFormat('en-US').format(totalAmount ?? 0)}
          </div>
          <div style={{ marginLeft: '50px' }}>
            취소 금액: {new Intl.NumberFormat('en-US').format(totalRefund ?? 0)}
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
      <ConsultantPayHistoryModel
        state={state}
        setState={setState}
        isConsultantPayHistory={isConsultantPayHistory}
        setIsConsultantPayHistory={setIsConsultantPayHistory}
        payHisData={payHisData}
        setPayHisData={setPayHisData}
      />
    </GridContainer>
  );
};
export default PaymentDetailsGridTable;
