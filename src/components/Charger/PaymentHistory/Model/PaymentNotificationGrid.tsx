import { useEffect, useRef, useContext, useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import Tabs from 'components/common/Tab/Tabs';
import {
  DefaultDiv,
  GridHeader,
  Spinner,
  AUIGridContainer,
} from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { useGetListWtTrigger } from 'hooks/useGetListWt';
import * as IGrid from 'aui-grid';
const PaymentNotificationGrid = ({
  // state,
  // setState,
  setModalNotiData,
  modalNotiData,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, data, getData, totalCount } =
    useGetListWtTrigger<any>();
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const handleCloseModal = () => {
    setModalNotiData('');
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (modalNotiData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/payment-notifications?cno=${modalNotiData?.cno}`,
      });
      setIsModalOpen(true);
    }
  }, [modalNotiData]);
  useEffect(() => {
    if (state.isSuccess) {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/payment-notifications?cno=${modalNotiData?.cno}`,
      });
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);
  const myGrid = useRef<AUIGrid>(null);
  const grid = myGrid.current as AUIGrid;
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 300,
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
      dataField: 'stat_msg',
      headerText: '상태',
      width: '4%',
      minWidth: 50,
      editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'res_msg',
      headerText: '결과',
      width: '4%',
      minWidth: 50,
      editable: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'mgr_amt',
      headerText: '금액',
      width: '4%',
      minWidth: 50,
      editable: true,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        // console.log(item);
        return String(value || item?.amount || '0') + '원';
      },
    },
    // {
    //   dataField: 'card_no',
    //   headerText: '카드번호',
    //   editable: true,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    // {
    //   dataField: 'issuer_nm',
    //   headerText: '카드사명',
    //   editable: true,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },

    {
      dataField: 'createdAt',
      headerText: '결제시간',
      width: '15%',
    },
  ];
  useEffect(() => {
    if (!loading && data !== null) {
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
      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      grid.setGridData(data2);
    }
  }, [loading, data]);

  return (
    <Modal
      open={isModalOpen}
      title="히스토리"
      close={handleCloseModal}
      style={{ width: '700px' }}
    >
      <DefaultDiv>
        {/* <GridHeader between>
        // Header for search function
      </GridHeader> */}
        <AUIGridContainer isTableButton={true} style={{ height: '300px' }}>
          {loading && <Spinner />}

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

export default PaymentNotificationGrid;
