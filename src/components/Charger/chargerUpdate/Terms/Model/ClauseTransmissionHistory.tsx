import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
} from 'react';

// 패키지
import { Form } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { AUIGridContainer, Spinner } from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { useGetListWt } from 'hooks/useGetListWt';
import { type StateInterface } from 'interfaces/ICommon';
interface ModalProps {
  setOpenDetailModel: Dispatch<SetStateAction<any>>;
  openDetailModel: boolean;
  setTermsId: Dispatch<SetStateAction<number | ''>>;
  termsId: string | number;
}

const ClauseTransmissionHistory = ({
  termsId,
  setTermsId,
  openDetailModel,
  setOpenDetailModel,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [fileUrl, setFileUrl] = useState<string>('');
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    division: 'TM',
    startDate: '',
    endDate: '',
  });

  function handleCloseModal() {
    setOpenDetailModel(false);
    form.resetFields();
  }

  const { loading, error, data, refetch, totalCount } = useGetListWt({
    url: `/charger-ocpp-log?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&chg_id=${termsId}`,
  });

  const myGrid = useRef<AUIGrid>(null);
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
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    selectionMode: 'multipleRows', // singleCell or multipleRows
    // rowCheckToRadio: true,
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
        return value ? value - _rowIndex : '';
      },
    },
    {
      dataField: 'division',
      headerText: '구분',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'TM') {
          return '약관';
        }
        if (value === 'AD') {
          return '광고';
        }
        return '-';
      },
    },
    {
      dataField: 'version',
      headerText: '버전',
      width: 90,
    },
    {
      dataField: 'fileURL',
      headerText: '파일 URL',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.split('/').pop();
      },
    },
    {
      dataField: 'fileOCPPLogs',
      headerText: '최신버전',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value?.newestVersion === true) {
          return 'O';
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'updatedAt',
      headerText: '업데이트 일자',
      width: 150,
    },
    {
      dataField: 'createdBy',
      headerText: '담당자',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        const name = String(value?.name) + '(' + String(value?.accountId) + ')';
        return value?.name ? name : '-';
      },
    },
  ];
  useEffect(() => {
    if (!loading && data !== null && openDetailModel) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      grid?.setGridData(data2);
    }
  }, [loading, data]);

  useEffect(() => {
    if (openDetailModel) {
      refetch();
    }
  }, [openDetailModel]);

  async function onFinish(values: any) {
    const grid = myGrid.current as AUIGrid;
    const checkedItems = grid.getCheckedRowItems();
    // const id = checkedItems[0]?.item?.id;
    const url = checkedItems[0]?.item?.fileURL;
    if (checkedItems.length > 0) {
      setFileUrl(url);
    }
    // console.log(fileUrl);
    setState({ isLoading: false, error: null, isSuccess: true });
  }

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
      setState({ ...state, isSuccess: false });
    }
  }, [state]);

  return (
    <>
      {openDetailModel && (
        <Modal
          open={openDetailModel}
          title="약관전송 이력"
          close={handleCloseModal}
        >
          <StyledForm
            form={form}
            name="SendTermsDetail"
            colon={false}
            type="modal"
          >
            <div style={{ gridColumn: 'auto / span 3' }}>
              <AUIGridContainer isTableButton={true}>
                {loading && <Spinner />}
                <AUIGrid
                  ref={myGrid}
                  columnLayout={columnLayout}
                  gridProps={gridProps}
                />
              </AUIGridContainer>
            </div>
          </StyledForm>
          <ModalFooter
            okText="등록"
            closeText="취소"
            close={handleCloseModal}
            isOk={false}
          />
        </Modal>
      )}
    </>
  );
};

export default ClauseTransmissionHistory;
