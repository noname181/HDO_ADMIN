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
import { postApi } from 'apis/postApi';
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
import {
  CloseButton,
  CustomCloseButton,
} from 'components/common/Button/CloseButton';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
const SendTermsDetail = ({
  chargerData,
  setChargerData,
  isModalOpen,
  setIsModalOpen,
  setState,
  state,
  setSendId,
}: any) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
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
    setIsModalOpen(false);
    form.resetFields();
  }
  const apiUrl = process.env.REACT_APP_API_URL;
  const { loading, error, data, refetch, totalCount } = useGetListWt({
    url: `/file-to-update?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
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
    showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    selectionMode: 'multipleRows', // singleCell or multipleRows
    rowCheckToRadio: true,
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
      style: 'text-center',

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
      style: 'text-center',
    },
    {
      dataField: 'fileURL',
      headerText: '파일 URL',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.split('/').pop();
      },
    },
    {
      dataField: 'newestVersion',
      headerText: '최신버전',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return 'O';
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      style: 'text-center',
      width: 150,
    },
  ];
  useEffect(() => {
    if (!loading && data !== null && isModalOpen) {
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
    if (isModalOpen) {
      refetch();
      console.log(chargerData);
    }
  }, [isModalOpen]);

  async function onFinish(values: any) {
    const grid = myGrid.current as AUIGrid;
    const checkedItems = grid.getCheckedRowItems();
    if (checkedItems.length <= 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '안내',
        content: '전송할 파일을 선택해주세요',
      });
      return;
    }
    const id = checkedItems[0]?.item?.id;
    const url = checkedItems[0]?.item?.fileURL;
    const version = checkedItems[0]?.item?.version;
    const newestVersion = checkedItems[0]?.item?.newestVersion;
    const spFileName = url.split('/').pop();
    // setFileUrl(String(spFileName));
    setFileUrl(url);

    const chargerId = await chargerData?.map((item: any, index: any) => {
      return item.chg_id;
    });
    const addData = {
      div: 'TM',
      url: String(apiUrl) + '/download-file/upload/' + String(spFileName),
      file_id: id,
      version: version,
      newestVersion: newestVersion,
      chargers: chargerId,
    };

    await postApi(
      {
        url: `/charger-update/`,
        data: addData,
      },
      setState,
    );

    // console.log(fileUrl);
    // setState({ isLoading: false, error: null, isSuccess: true });
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
    if (state.error) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  useEffect(() => {
    if (isModalOpen && chargerData.length === 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '안내' ?? 'api 호출 에러 : 콘솔창 확인',
        content: '대상을 선택하세요.' ?? 'api 호출 에러 : 콘솔창 확인',
        onCancel() {
          setAlertModal({
            ...alertModal,
            open: false,
          });
          handleCloseModal();
        },
        onOk() {
          setAlertModal({
            ...alertModal,
            open: false,
          });
          handleCloseModal();
        },
      });
    }
  }, [chargerData, isModalOpen]);
  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="약관전송" close={handleCloseModal}>
          <StyledForm
            form={form}
            name="SendTermsDetail"
            colon={false}
            type="modal"
          >
            <div style={{ gridColumn: '1 / span 3' }}>
              <p className="nl-lbl">충전기</p>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                {chargerData?.map((item: any, index: any) => {
                  return (
                    <>
                      <CustomCloseButton key={index}>
                        {item?.chg_charger_id} | {item?.chargerModel?.modelName}
                        <CloseButton
                          onClick={(event) => {
                            // event.preventDefault();
                            setChargerData((prevItems: any) => {
                              return prevItems.filter(
                                (item2: any) => item2?.chg_id !== item?.chg_id,
                              );
                            });
                            setSendId((prevItems: any) => {
                              return prevItems.filter(
                                (item2: any) => item2 !== item?.chg_id,
                              );
                            });
                          }}
                        ></CloseButton>
                      </CustomCloseButton>
                    </>
                  );
                })}

                {/* <Button onClick={handleClickBtn2}>주유소 명 | 충전기 ID</Button>
                <Button onClick={handleClickBtn3}>주유소 명 | 충전기 ID</Button> */}
              </div>
            </div>
            <div style={{ gridColumn: 'auto / span 3' }}>
              <p className="nl-lbl">전송파일 버전</p>
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
            onOk={handleOk}
          />
        </Modal>
      )}
    </>
  );
};

export default SendTermsDetail;
