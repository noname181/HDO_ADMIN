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
// import PaymentHistoryRegister from './Model/PaymentHistoryRegister';
import { hdoInstance } from 'apis/hdoInstance';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import PaymentRefund from './Model/PaymentRefund';
import PaymentNotificationGrid from './Model/PaymentNotificationGrid';
import ConsultantPayHistoryModel from 'pages/cs/CSHome/Model/ConsultantPayHistoryModel';

interface PaymentHistoryInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
  division: '' | 'STORE' | 'EMPLOYMERCHAN';
  member: '' | 'Y' | 'N';
  reservation: '' | 'Y' | 'N';
  vehicle: '' | 'Y' | 'N';
  payType: '' | 'pre' | 'partial';
  speed: string;
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
  queryState: PaymentHistoryInterface;
  setQueryState: React.Dispatch<React.SetStateAction<PaymentHistoryInterface>>;
  totalClKwh: any;
  totalIgnoredKwh: any;
}
const PaymentHistoryGridTable = ({
  queryState,
  setQueryState,
  loading,
  data,
  state,
  setState,
  totalCount,
  totalClKwh,
  totalIgnoredKwh,
}: StationGridTableProps) => {
  const payHisGrid = useRef<AUIGrid>(null);
  const [isModalOpenRefund, setIsModalOpenRefund] = useState(false);
  const [modalNotiData, setModalNotiData] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [pgCno, setpgCno] = useState('');
  const [clID, setClID] = useState<number | ''>('');
  const [isConsultantPayHistory, setIsConsultantPayHistory] =
    useState<boolean>();
  const [payHisData, setPayHisData] = useState<any>();

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const columnLayout: IGrid.Column[] = [
    // {
    //   dataField: 'isActive',
    //   headerText: '',
    //   headerRenderer: {
    //     type: IGrid.headerRendererKind.CheckBoxHeaderRenderer,
    //     // 헤더의 체크박스가 상호 의존적인 역할을 할지 여부(기본값:false)
    //     // dependentMode 는 renderer 의 type 으로 CheckBoxEditRenderer 를 정의할 때만 활성화됨.
    //     // true 설정했을 때 클릭하면 해당 열의 필드(데모 상은 isActive 필드)의 모든 데이터를 true, false 로 자동 바꿈
    //     dependentMode: true,
    //   },
    //   renderer: {
    //     type: IGrid.RendererKind.CheckBoxEditRenderer,
    //     editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
    //   },
    //   width: 40,
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
      dataField: 'createdAt',
      headerText: '결제일',
      width: '8%',
      minWidth: 160,

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
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
      width: '12%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'sb_charger_memb',
      headerText: '충전기 ID',
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
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return String(value?.appliedUnitPrice) + '원' ?? '-';
      // },
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
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   let scanType = '-';
      //   if (value?.scanType === 1) {
      //     scanType = 'QR';
      //   } else if (value?.scanType === 2) {
      //     scanType = 'NFC';
      //   }
      //   return value?.scanType ? scanType : '-';
      // },
    },
    {
      dataField: 'chargingLogs',
      headerText: '회원구분',
      //분류
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.userNew?.accountId ? '회원' : '비회원';
      },
      // renderer: {
      //   type: IGrid.RendererKind.LinkRenderer,
      //   linkField: '#',
      // },
    },
    {
      dataField: 'card_no',
      headerText: '카드번호',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'issuer_nm',
      headerText: '카드사',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'stat_msg',
      headerText: '결제 상태',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return '결제완료';
      },
    },
    {
      dataField: 'totalPayment',
      headerText: ' 총 결제금액',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '-';
      },
    },
    // {
    //   dataField: 'amount',
    //   headerText: '선결제 금액',
    //   //결제금액
    //   width: '8%',
    //   minWidth: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     // var formattedPrice = 0;
    //     // value?.map((item: any, index: any) => {
    //     //   if (item?.noti_type === '10') {
    //     //     formattedPrice = item?.amount;
    //     //   }
    //     // });
    //     // if (formattedPrice !== 0) {
    //     //   const formattedPriceCheck = new Intl.NumberFormat('en-US').format(
    //     //     formattedPrice,
    //     //   );

    //     //   return formattedPriceCheck + '원' ?? '-';
    //     // } else {
    //     //   return '';
    //     // }
    //     const formattedPriceCheck = new Intl.NumberFormat('en-US').format(
    //       value,
    //     );
    //     return formattedPriceCheck + '원' ?? '-';
    //   },
    // },
    // {
    //   dataField: 'totalMgrAmtTs06',
    //   headerText: '부분취소',
    //   width: '12%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     const formattedPrice = value;
    //     if (formattedPrice != 0) {
    //       const formattedPriceCheck = new Intl.NumberFormat('en-US').format(
    //         formattedPrice,
    //       );
    //       return formattedPriceCheck + '원' ?? '-';
    //     } else {
    //       return '-';
    //     }
    //   },
    // },
    // {
    //   dataField: 'totalMgrAmtTs05',
    //   headerText: '환불금액',
    //   width: '12%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     const formattedPrice = value;
    //     if (formattedPrice != 0) {
    //       const formattedPriceCheck = new Intl.NumberFormat('en-US').format(
    //         formattedPrice,
    //       );
    //       return formattedPriceCheck + '원' ?? '-';
    //     } else {
    //       return '-';
    //     }
    //   },
    // },
    // {
    //   dataField: 'paymentNotification',
    //   headerText: '환불금액',
    //   //결제금액
    //   width: '8%',
    //   minWidth: 100,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     var formattedPrice = 0;
    //     value?.map((item: any, index: any) => {
    //       if (item?.noti_type === '20') {
    //         formattedPrice += item?.mgr_amt;
    //       }
    //     });
    //     if (formattedPrice !== 0) {
    //       const formattedPriceCheck = new Intl.NumberFormat('en-US').format(
    //         formattedPrice,
    //       );

    //       return formattedPriceCheck + '원' ?? '-';
    //     } else {
    //       return '';
    //     }
    //   },
    // },
    // {
    //   dataField: 'areaName',
    //   headerText: '부문',
    //   labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
    //     return _item?.chargingStationUseLog?.org?.category === 'EV_DIV'
    //       ? 'EV사업부'
    //       : value;
    //   },
    // },
    // {
    //   dataField: 'branchName',
    //   headerText: '지사',
    //   labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
    //     return _item?.chargingStationUseLog?.org?.category === 'EV_DIV'
    //       ? 'EV사업부'
    //       : value;
    //   },
    // },
    // {
    //   dataField: 'chargingStationUseLog',
    //   headerText: '구분',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return category(value?.org?.category) ?? '';
    //   },
    // },

    // {
    //   dataField: 'chargerUseLog',
    //   headerText: '충전기 ID',
    //   width: '12%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.chg_charger_id ?? '-';
    //   },
    // },

    // {
    //   dataField: 'chargerUseLog',
    //   headerText: '충전예약',

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.status === 'ACTIVE' ? '사용' : '미사용';
    //   },
    // },

    // {
    //   dataField: 'chargerUseLog',
    //   headerText: '속도',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.chargerModel?.maxKw
    //       ? String(value?.chargerModel?.maxKw) + 'kWh'
    //       : '-';
    //   },
    // },

    // {
    //   dataField: 'pg_cno',
    //   headerText: '승인번호',

    //   width: 200,
    // },

    // {
    //   dataField: 'chargerUseLog',
    //   headerText: '충전 ID',

    //   width: '8%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.chg_charger_id ?? '-';
    //   },
    // },

    // {
    //   dataField: 'userNew',
    //   headerText: '유저 ID',

    //   width: '8%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.accountId ?? '-';
    //   },
    // },
    // {
    //   dataField: 'userNew',
    //   headerText: '이름',
    //   width: 100,

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.name ?? '-';
    //   },
    // },
    // {
    //   dataField: 'userNew',
    //   headerText: '전화번호',
    //   width: 100,

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.phoneNo ?? '-';
    //   },
    // },

    // {
    //   dataField: '',
    //   headerText: '환불 시간',
    //   width: '8%',
    //   minWidth: 100,

    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    // {
    //   dataField: 'edit',
    //   headerText: '히스토리',
    //   width: '8%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.ButtonRenderer,
    //     labelText: '히스토리',
    //     onClick: function (event) {
    //       setModalNotiData(event.item);
    //     },
    //   },
    // },
    // {
    //   dataField: 'edit',
    //   headerText: '환불하기',
    //   width: '8%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.ButtonRenderer,
    //     labelText: '환불신청',
    //     onClick: function (event) {
    //       setIsConsultantPayHistory(true);
    //       console.log(event);
    //       setPayHisData(event.item);
    //       // setIsModalOpenRefund(true);
    //       // console.log('', event.item);
    //       // calculateRefundAmount(event.item);
    //       // setAlertModal({
    //       //   ...alertModal,
    //       //   open: true,
    //       //   type: 'alert',
    //       //   title: '환불하기',
    //       //   content: '얼마를 환불할까요? <br> <input type="text">',
    //       // });
    //     },
    //   },
    // },
  ];

  // const calculateRefundAmount = (paymentHistory: any) => {
  //   const url = `/v1/payment-notifications?cno=${paymentHistory?.cno}`;
  //   const accessToken = localStorage.getItem('accessToken') ?? '';

  //   if (!accessToken) return;
  //   const axios = hdoInstance();
  //   axios(url, {
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   })
  //     .then((result) => {
  //       let totalPay = 0;
  //       let totalRefund = 0;
  //       result.data.result.map((item: any) => {
  //         if (item.noti_type && item.noti_type === '10') {
  //           totalPay += item.amount;
  //         }
  //         if (item.noti_type && item.noti_type === '20') {
  //           totalRefund += item.mgr_amt;
  //         }
  //       });
  //       setCalculatedAmount(totalPay - totalRefund);
  //       setpgCno(paymentHistory?.cno);
  //       setClID(paymentHistory?.chargingLogs?.cl_id);
  //     })
  //     .catch((error) => {
  //       setpgCno('');
  //       console.log(error);
  //     });
  //   setCalculatedAmount(0);
  // };

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
      `/v1/payment/history?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}&speed=${queryState.speed}&method=${queryState.method}&category=${queryState.category}&member=${queryState.member}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`;

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
      <GridButton label="충전내역 목록" myGrid={payHisGrid}>
        {/* <PaymentHistoryRegister state={state} setState={setState} /> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-bwtween',
            marginRight: '50px',
          }}
        >
          <div>
            총 충전량 (kWh):{' '}
            {new Intl.NumberFormat('en-US').format(totalClKwh ?? 0)}
          </div>
          {/* <div style={{ marginLeft: '50px' }}>
            실제 충전량 (kWh):{' '}
            {new Intl.NumberFormat('en-US').format(totalIgnoredKwh ?? 0)}
          </div> */}
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
      {/* <PaymentRefund
        state={state}
        setState={setState}
        setIsModalOpenRefund={setIsModalOpenRefund}
        isModalOpenRefund={isModalOpenRefund}
        refundAmount={calculatedAmount}
        pgCno={pgCno}
        setpgCno={setpgCno}
        clID={clID}
        setClID={setClID}
      /> */}
      <PaymentNotificationGrid
        // state={state}
        // setState={setState}
        setModalNotiData={setModalNotiData}
        modalNotiData={modalNotiData}
      />
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
export default PaymentHistoryGridTable;
