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
    const url = `/v1/settlement/popup?data_day=${date}&type=BANKING`;
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
      dataField: 'TRADT',
      headerText: '전송일자',
      // editable: true,
      width: '10%',
      minWidth: 130,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'BNKCD',
      headerText: '은행코드',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'SNDID',
      headerText: '송신자 ID',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'RCVID',
      headerText: '수신자 ID',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'LCONO',
      headerText: '명세통지 번호',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'BAKNO',
      headerText: '계좌번호',
      // editable: true,
      width: '10%',
      minWidth: 130,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'TRAMT',
      headerText: '이체금액',
      // editable: true,
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        if (value) {
          const formattedValue = new Intl.NumberFormat('en-US').format(value);
          return formattedValue ?? '-';
        } else return '-';
      },
    },
    {
      dataField: 'TRATM',
      headerText: '거래시간',
      // editable: true,
      width: '10%',
      minWidth: 130,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    // {
    //   dataField: 'd10',
    //   headerText: '전표처리 대상여부',
    //   // editable: true,
    // },
    // {
    //   dataField: 'd11',
    //   headerText: '결과 코드',
    //   // editable: true,
    // },
    // {
    //   dataField: 'd12',
    //   headerText: '결과 메시지',
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
      const datafake = [];

      for (let i = 15; i > 0; i--) {
        datafake.push({
          d1: i,
          d2: '2023-09-10 18:00',
          d3: '3',
          d4: 'sender01',
          d5: 'receiver01',
          d6: '123',
          d7: '123-456789-01-01',
          d8: '1,000,000',
          d9: '2023-09-10 18:00',
          d10: '아니오',
          d11: '성공',
          d12: '처리 완료',
        });
      }
      // grid?.setGridData(datafake);
      grid.setGridData(state.data);
    }
  }, [state]);

  return (
    <Modal
      open={isModalOpen}
      title="펌뱅킹 정산자료 수신 결과"
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
