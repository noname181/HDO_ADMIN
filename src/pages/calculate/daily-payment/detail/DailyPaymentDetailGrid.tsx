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

const DailyPaymentDetailGrid = ({
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
  async function onResultInquiry(data: any) {
    const url = `/settlement-erp-request?date=${data?.SDODT}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios
      .get(url, {
        headers: {
          location: '/daily-payment',
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
  async function onResendERP(id: string, date: string) {
    const data = {
      transaction_id: id,
      data_day: date ? date.replace(/-/g, '') : '',
    };
    const url = `/v1/ws/clearing`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(url, data, {
        headers: {
          location: '/daily-payment',
          Authorization: accessToken,
        },
      })
      .then((result) => {
        // console.log(result);
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
        // setState({ ...state, isLoading: false, isSuccess: false });
        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'error',
        //   title: error?.response?.data?.errorCode ?? '환불하기',
        //   content:
        //     error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        // });
        setAlertModal({
          ...alertModal,
          open: false,
        });
      });

    if (reload) {
      reload();
    }
  }
  const HandleResendERP = (id: string, date: string) => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: 'Alert',
      content: `ERP로 재송신 하시겠습니까?`,
      okText: '확인',
      onCancel() {},
      onOk() {
        void onResendERP(id, date);
      },
    });
  };
  const HandleResultInquiry = () => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: 'Alert',
      content: ``,
      okText: '재시도',
      cancelText: '재시도',
      onCancel() {},
      onOk() {
        // void onResultInquiry(data);
      },
    });
  };
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
      dataField: 'SDODT',
      headerText: '수금일자',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value;
      },
    },

    {
      dataField: 'branchName',
      headerText: '지사',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return value;
      },
    },

    {
      dataField: 'station_name',
      headerText: '충전소 명',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'station_id',
      headerText: '충전소 ID',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'TRAGB',
      headerText: '이체건수',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'TRAMT',
      headerText: '총 이체금액',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return value ? new Intl.NumberFormat('en-US').format(value) : '0';
      },
    },
    {
      dataField: 'erp_send_result',
      headerText: '송신 결과 코드',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'S':
            return '성공';
          case 'E':
            return '실패';
          default:
            return '';
        }
      },
    },

    {
      dataField: 'edit',
      headerText: 'ERP 재전송',
      width: '8%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '재시도',
        onClick: function (event) {
          HandleResendERP(event?.item?.id, event?.item?.SDODT);
        },
      },
    },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'deposit_count',
      headerText: '총 이제 금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return (
          `${new Intl.NumberFormat('en-US').format(_item?.sumTRAMT)}원` || '-'
        );
      },
    },

    {
      dataField: 'deposit_amount',
      headerText: '총 이체건수',
      width: '8%',
      minWidth: 100,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return (
          `${new Intl.NumberFormat('en-US').format(_item?.sumTRAGB)}건` || '-'
        );
      },
    },

    {
      dataField: 'data_results',
      headerText: '펌뱅킹 정산 결과',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, item) {
        return (
          `${new Intl.NumberFormat('en-US').format(item?.sumTRAGB)}건` || '-'
        );
      },
    },
  ];
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/daily-payment-detail?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&date=${keydata}&area=${queryState.area}&branch=${queryState.branch}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Location: '/daily-payment',
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
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          // if (event.checked) {
          //   setCheckRowId((value: any) => [...value, event.item.id]);
          // }
          // if (!event.checked) {
          //   setCheckRowId((value: any) => {
          //     const newCheckRowId = value.filter(
          //       (item: any) => item !== event.item.id,
          //     );
          //     return newCheckRowId;
          //   });
          // }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          // if (event.checked) {
          //   const dataItems = grid?.getGridData() as Array<{ id: number }>;
          //   setCheckRowId(dataItems?.map((item) => item.id));
          // } else {
          //   setCheckRowId([]);
          // }
        },
      );
      // const data3 = data?.map((item: any) => ({
      //   ...item,
      //   totalCount,
      // }));
      // fake data
      const datafake = [];

      datafake.push({
        d1: '24,310,000',
        d2: '1,309',
        d3: '1,309(1)',
        d4: '40(4)',
      });

      const datafake2 = [];
      for (let i = 30; i > 0; i--) {
        datafake2.push({
          d1: i,
          d2: '2023-09-10',
          d3: '중부',
          d4: '서울',
          d5: '현대',
          d6: '01',
          d7: '8,310,000',
          d8: '1,142',
          d9: '성공',
          d10: '실패',
        });
      }
      // 그리드 데이터 세팅
      grid2?.setGridData({
        ...data2,
        sumTRAGB: dataAll.sumTRAGB || 0,
        sumTRAMT: dataAll.sumTRAMT || 0,
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
      <GridButton label="매출 내역" myGrid={myGrid} />
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
export default DailyPaymentDetailGrid;
