import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';

interface StationGridTableProps {
  loading: boolean;
  data: any;
  dataAll: any;
  data2: any;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  totalCount: number | null;
  queryState: any;
  keydata: string;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  reload?: () => void;
}

const SettlementDetailGrid = ({
  loading,
  data,
  dataAll,
  data2,
  state,
  setState,
  totalCount,
  keydata,
  queryState,
  setQueryState,
  reload,
}: StationGridTableProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const myGrid = useRef<AUIGrid>(null);
  const myGrid2 = useRef<AUIGrid>(null);
  // console.log(data);
  async function onResendERP(data: any) {
    const dataBody = {
      data_day: data?.data_day ? data?.data_day.replace(/-/g, '') : '',
      erp_id: data?.erp_id,
      payment_method: data?.payment_method,
    };
    const url = `/v1/settlement-detail-erp/resend`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(url, dataBody, {
        headers: {
          location: '/settlement',
          Authorization: accessToken,
        },
      })
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '송신하였습니다.',
        });
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: false,
        });
      });

    if (reload) {
      reload();
    }
  }

  async function onResultInquiry(data: any) {
    const url = `/settlement-erp-request?date=${data?.data_day}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios
      .get(url, {
        headers: {
          location: '/settlement',
          Authorization: accessToken,
        },
      })
      .then((result) => {
        // console.log(result);
        // setErpSendResult(result?.data?.result?.[0]?.erp_send_result);
        setAlertModal({
          ...alertModal,
          open: false,
        });
      })
      .catch((error) => {
        console.log(error);
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
      });
  }

  const HandleResendERP = (data: any) => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: 'Alert',
      content: `ERP로 재송신 하시겠습니까?`,
      okText: '확인',
      onCancel() {},
      onOk() {
        void onResendERP(data);
      },
    });
  };
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
      dataField: 'data_day',
      headerText: '매출일자',
      width: '8%',
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      width: 70,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value;
      },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      width: 70,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value;
      },
    },
    {
      dataField: 'station_name',
      headerText: '충전소 명',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소 ID',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value;
      },
    },
    {
      dataField: 'transaction_count',
      headerText: '결제건수',
      width: 90,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'cancel_count',
      headerText: '환불 건수',
      width: 90,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'daycharge_amount',
      headerText: '총 충전량 (kWh)',
      width: 130,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'daycharge_amount_minus_dayignore_amount',
      headerText: '실제 충전량',
      width: 130,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'dayignore_amount',
      headerText: '충전판매손실',
      width: 130,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'sales_amount',
      headerText: '정산대상 매출액',
      width: 120,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(Number(value)) + '원'
          : '0';
      },
    },
    {
      dataField: 'cancel_amount',
      headerText: '총 환불 금액',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0';
      },
    },
    {
      dataField: 'commission_amount',
      headerText: '총 수수료',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0';
      },
    },
    {
      dataField: 'sum_sales_amount_cancel_amount_commission_amount',
      headerText: '지급대상금액',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? new Intl.NumberFormat('en-US').format(value) + '원'
          : '0';
      },
    },
    {
      dataField: 'erp_send_result_first',
      headerText: '최초 송신/확인결과',
      width: 100,
      labelFunction: function (
        rowIndex,
        columnIndex,
        value,
        _headerText,
        _item,
      ) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // console.log(event);
            if (event.dataField === 'erp_send_result_first') {
              setAlertModal({
                ...alertModal,
                open: true,
                type: 'alert',
                title: '알림',
                cancelText: '닫기',
                isOk: false,
                content: (
                  <>
                    <p>최초 송신결과 : {event.item?.erp_send_message_first}</p>
                    <p>최초 확인결과 : {event.item?.erp_check_message_first}</p>
                    {!event.item?.erp_send_message_first &&
                      !event.item?.erp_check_message_first &&
                      'No message.'}
                  </>
                ),
              });
            }
          },
        );
        var text222 = '';
        if (_item.erp_send_result_first === 'S') {
          text222 += '성공';
        }
        if (_item.erp_send_result_first === 'E') {
          text222 += '실패';
        }
        if (
          _item.erp_send_result_first === 'S' ||
          _item.erp_send_result_first === 'E'
        ) {
          text222 += ' / ';
        }
        if (_item.erp_check_result_first === 'S') {
          text222 += '성공';
        }
        if (_item.erp_check_result_first === 'E') {
          text222 += '실패';
        }
        if (!_item.erp_check_result_first) {
          text222 += '미확인';
        }
        return text222;
      },
    },
    {
      dataField: 'edit',
      headerText: 'ERP 재전송',
      width: 110,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '재시도',

        onClick: function (event) {
          HandleResendERP(event?.item);
        },
      },
    },
    {
      dataField: 'erp_send_result_last',
      headerText: '최근 송신/확인결과',
      style: 'red',
      width: 120,
      // labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
      //   var text222 = '';
      //   if (_item.erp_send_result_last === 'S') {
      //     text222 += '성공';
      //   }
      //   if (_item.erp_send_result_last === 'E') {
      //     text222 += '실패';
      //   }
      //   if (_item.erp_check_result_last === 'S') {
      //     text222 += ' / 성공';
      //   }
      //   if (_item.erp_check_result_last === 'E') {
      //     text222 += ' / 실패';
      //   }
      //   if (!_item.erp_check_result_last) {
      //     text222 += ' / 미확인';
      //   }
      //   return text222;
      // },
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          return value;
        },
      },
      labelFunction: function (
        rowIndex,
        columnIndex,
        value,
        _headerText,
        _item,
      ) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // console.log(event);
            if (event.dataField === 'erp_send_result_last') {
              setAlertModal({
                ...alertModal,
                open: true,
                type: 'alert',
                title: '알림',
                cancelText: '닫기',
                isOk: false,
                content: (
                  <>
                    <p>최근 송신결과 : {event.item?.erp_send_message_last}</p>
                    <p>최근 확인결과 : {event.item?.erp_check_message_last}</p>
                    {!event.item?.erp_send_message_last &&
                      !event.item?.erp_check_result_last &&
                      'No message.'}
                  </>
                ),
              });
            }
          },
        );
        var text222 = '';
        if (_item.erp_send_result_last === 'S') {
          text222 += '성공';
        }
        if (_item.erp_send_result_last === 'E') {
          text222 += '실패';
        }
        if (
          _item.erp_send_result_last === 'S' ||
          _item.erp_send_result_last === 'E'
        ) {
          text222 += ' / ';
        }
        if (_item.erp_check_result_last === 'S') {
          text222 += '성공';
        }
        if (_item.erp_check_result_last === 'E') {
          text222 += '실패';
        }
        if (!_item.erp_check_result_last) {
          text222 += '미확인';
        }

        return text222;
      },
    },
    {
      dataField: 'edit',
      headerText: '처리결과조회',
      width: 120,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '결과조회',
        onClick: function (event) {
          setState({
            ...state,
            isLoading: true,
          });
          if (reload) {
            reload();
            setTimeout(() => {
              setState({
                ...state,
                isLoading: false,
              });
            }, 500);
          }
        },
      },
    },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'sum_sales_amount',
      headerText: '정산대상 매출액',
      width: '8%',
      minWidth: 100,

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? `${new Intl.NumberFormat('en-US').format(Number(value))}원`
          : '0';
      },
    },

    {
      dataField: 'sum_cancel_amount',
      headerText: '총 환불 금액',
      width: '8%',
      minWidth: 100,

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? `${new Intl.NumberFormat('en-US').format(value)}원`
          : '0';
      },
    },

    {
      dataField: 'sum_commission_amount',
      headerText: '총 수수료',

      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? `${new Intl.NumberFormat('en-US').format(value)}원`
          : '0';
      },
    },

    {
      dataField: 'sum_sales_amount_cancel_amount_commission_amount',
      headerText: '지급대상금액',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value
          ? `${new Intl.NumberFormat('en-US').format(value)}원`
          : '0';
      },
    },
    {
      dataField: 'totalChargingLogs',
      headerText: '총 충전량 (kWh)',

      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item.sum_daycharge_amount
          ? `${new Intl.NumberFormat('en-US').format(
              _item.sum_daycharge_amount,
            )}`
          : '0';
      },
    },
    {
      dataField: '',
      headerText: '실제 충전량',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item.sum_daycharge_amount_minus_dayignore_amount
          ? `${new Intl.NumberFormat('en-US').format(
              _item.sum_daycharge_amount_minus_dayignore_amount,
            )}`
          : '0';
      },
    },
    {
      dataField: '',
      headerText: '충전판매손실',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item.sum_dayignore_amount
          ? `${new Intl.NumberFormat('en-US').format(
              _item.sum_dayignore_amount,
            )}`
          : '0';
      },
    },
    {
      dataField: 'transaction_count',
      headerText: '총 결제건수',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item.sum_transaction_count
          ? `${new Intl.NumberFormat('en-US').format(
              _item.sum_transaction_count,
            )}`
          : '0';
      },
    },
    {
      dataField: 'cancel_count',
      headerText: '환불 건수',

      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item.sum_cancel_count
          ? `${new Intl.NumberFormat('en-US').format(_item.sum_cancel_count)}`
          : '0';
      },
    },
    {
      dataField: 'totalCountPG',
      headerText: 'PG 정산 결과',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? `${new Intl.NumberFormat('en-US').format(value)}` : '0';
      },
    },
    {
      dataField: 'totalCountERP',
      headerText: 'ERP전송 결과',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ? `${new Intl.NumberFormat('en-US').format(value)}` : '0';
      },
      // renderer: {
      //   type: IGrid.RendererKind.TemplateRenderer,
      //   aliasFunction: function (
      //     rowIndex,
      //     columnIndex,
      //     value,
      //     headerText,
      //     item,
      //   ) {
      //     return value;
      //   },
      // },
      // labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
      //   const grid = myGrid.current as AUIGrid;
      //   grid.bind(
      //     IGrid.EventKind.CellDoubleClick,
      //     (event: IGrid.CellDoubleClickEvent) => {
      //       // setModalPGData(event?.item?.salesDate);
      //     },
      //   );
      //   return `<div style="display:flex;justify-content:center">999<div style="color:red;">(3)</div></div>`;
      // },
    },
  ];
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/settlement-detail?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&date=${keydata}&area=${queryState.area}&branch=${queryState.branch}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Location: '/settlement',
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log('result::', result);

        const data4 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data4);
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
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    enableRestore: true,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: false,
    showRowCheckColumn: false,
  };
  const gridProps2: IGrid.Props = {
    width: '100%',
    height: 100,
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    showAutoNoDataMessage: false,
    rowHeight: 40,
    enableRestore: true,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: false,
    showRowCheckColumn: false,
  };

  // const requestAddData = async () => {
  //   const grid = myGrid.current as AUIGrid;

  //   setQueryState({
  //     ...queryState,
  //     page: queryState.page++,
  //   });

  //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //   const url = `/v1/SalesDetail?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&area=${queryState.area}&branch=${queryState.branch}`;

  //   const accessToken = localStorage.getItem('accessToken') ?? '';

  //   if (!accessToken) return;

  //   const axios = hdoInstance();
  //   axios(url, {
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   })
  //     .then((result) => {
  //       const data2 = result?.data?.result?.map((item: any) => ({
  //         ...item,
  //         totalCount: result?.data?.totalCount,
  //       }));
  //       grid.appendData(data2);
  //     })
  //     .catch((error) => {
  //       setAlertModal({
  //         ...alertModal,
  //         open: true,
  //         type: 'error',
  //         title: error.code,
  //         content: error.message,
  //       });
  //       console.log(error);
  //     });
  // };
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      const grid2 = myGrid2.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {},
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

      // const data3 = data?.map((item: any) => ({
      //   ...item,
      //   totalCount,
      // }));
      // fake data
      // const datafake = [];

      // datafake.push({
      //   d1: '24,310,000',
      //   d2: '515,000',
      //   d3: '24,111',
      //   d4: '8,046,690',
      //   d5: '2,353KW',
      //   d6: '1,309',
      //   d7: '30',
      //   d8: '40(4)',
      // });

      // const datafake2 = [];
      // for (let i = 30; i > 0; i--) {
      //   datafake2.push({
      //     d1: i,
      //     d2: '2023-09-10',
      //     d3: '중부',
      //     d4: '서울',
      //     d5: '현대',
      //     d6: '01',
      //     d7: '8,310,000',
      //     d8: '10',
      //     d9: '812KW',
      //     d10: '8,310,000',
      //     d11: '255,900',
      //     d12: '8,310',
      //     d13: '8,034,341',
      //     d14: '성공',
      //     d15: '실패',
      //   });
      // }

      // 그리드 데이터 세팅
      grid2?.setGridData({
        ...data2,
        sum_cancel_amount: dataAll.sum_cancel_amount,
        sum_cancel_count: dataAll.sum_cancel_count,
        sum_commission_amount: dataAll.sum_commission_amount,
        sum_sales_amount_cancel_amount_commission_amount:
          dataAll.sum_sales_amount_cancel_amount_commission_amount,
        sum_daycharge_amount: dataAll.sum_daycharge_amount,
        sum_daycharge_amount_minus_dayignore_amount:
          dataAll.sum_daycharge_amount_minus_dayignore_amount,
        sum_dayignore_amount: dataAll.sum_dayignore_amount,
        sum_deposit_amount: dataAll.sum_deposit_amount,
        sum_sales_amount: dataAll.sum_sales_amount,
        sum_transaction_count: dataAll.sum_transaction_count,
        totalCountERP: dataAll.totalCountERP,
        totalCountPG: dataAll.totalCountPG,
      });

      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));

      grid?.setGridData(data3);
    }
  }, [loading, data]);
  return (
    <>
      <GridButton label="매출 내역" myGrid={myGrid}></GridButton>
      {state.isLoading && <Spinner />}
      <AUIGrid
        ref={myGrid2}
        columnLayout={columnLayout2}
        gridProps={gridProps2}
      />
      <AUIGridContainer
        isTableButton={true}
        from="settlementDetail"
        style={{ marginTop: 20 }}
      >
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
export default SettlementDetailGrid;
