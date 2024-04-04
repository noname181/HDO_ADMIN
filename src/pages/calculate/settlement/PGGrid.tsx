import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import { DefaultDiv, Spinner, AUIGridContainer } from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { hdoInstance } from 'apis/hdoInstance';
import dayjs from 'dayjs';
const PGGrid = ({ setModalPGData, modalPGData }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    data: [],
  });
  const handleCloseModal = () => {
    setModalPGData('');
    setIsModalOpen(false);
  };
  const requestAddData = async (date: string) => {
    setState({
      ...state,
      isLoading: true,
      isSuccess: false,
    });
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/settlement-result-pg/${date}`;
    // const url = `/settlement-result-pg/2023-11-17`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios
      .get(url, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((result) => {
        const data = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        setState({
          isLoading: false,
          isSuccess: true,
          data,
        });
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
        setState({
          ...state,
          isLoading: false,
          isSuccess: true,
        });
      });
  };

  useEffect(() => {
    if (modalPGData !== '') {
      void requestAddData(modalPGData);
      setIsModalOpen(true);
    }
  }, [modalPGData]);

  const myGrid = useRef<AUIGrid>(null);
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    autoGridHeight: false,
    fillColumnSizeMode: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    // editable: false,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
  };
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
      dataField: 'payment_date',
      headerText: '거래발생일자',
      // editable: true,
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return dayjs(value).format('YYYY-MM-DD') ?? '-';
      },
    },
    {
      dataField: 'charger',
      headerText: '충전소명',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'charger',
      headerText: '충전소 ID',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_station_id ?? '-';
      },
    },
    // {
    //   dataField: '',
    //   headerText: '충전기 ID',
    //   // editable: true,
    // },
    {
      dataField: 'org_id',
      headerText: '결제수단 코드',
      // editable: true,
    },
    {
      dataField: 'deal_type',
      headerText: '승인/취소',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'P' ? '취소' : value === 'A' ? '승인' : '-';
      },
    },
    {
      dataField: 'transaction_id',
      headerText: '거래 일련번호',
      // editable: true,
    },
    {
      dataField: 'deal_id',
      headerText: '가맹점 거래번호',
      // editable: true,
    },
    {
      dataField: 'pay_amount',
      headerText: '거래금액',
      // editable: true,
    },
    {
      dataField: 'approval_id',
      headerText: '승인번호',
      // editable: true,
    },
    // {
    //   dataField: '',
    //   headerText: '결과 코드',
    //   // editable: true,
    // },
    // {
    //   dataField: '',
    //   headerText: 'Summary',
    //   // editable: true,
    // },
  ];

  useEffect(() => {
    if (!state.isLoading && state.data !== null) {
      const grid = myGrid.current as AUIGrid;
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      // grid.bind(
      //   IGrid.EventKind.VScrollChange,
      //   (event: IGrid.VScrollChangeEvent) => {
      //     // console.log(event);
      //     const rowCount = grid.getRowCount();
      //     if (rowCount === totalCount) {
      //       grid.unbind(IGrid.EventKind.VScrollChange);
      //       return;
      //     }
      //   },
      // );

      grid.setGridData(state.data);
    }
  }, [state]);

  return (
    <Modal
      open={isModalOpen}
      title="PG 정산자료 수신 결과"
      close={handleCloseModal}
    >
      <DefaultDiv style={{ paddingBottom: 20 }}>
        {/* <GridHeader between>
        // Header for search function
      </GridHeader> */}
        {/* <p style={{ fontWeight: 'bold' }}>
          전체 : 100건 | 성공 : 99건 |{' '}
          <label style={{ color: 'red' }}>에러 : 1건</label>
        </p> */}

        <AUIGridContainer style={{ height: 500 }}>
          {state.isLoading && <Spinner />}
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </DefaultDiv>
    </Modal>
  );
};

export default PGGrid;
