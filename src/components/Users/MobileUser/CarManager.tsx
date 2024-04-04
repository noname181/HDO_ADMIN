import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
} from 'react';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { Form, Select, DatePicker } from 'antd';
import { putApi } from 'apis/putApi';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { DefaultDiv, GridHeader } from 'styles/style';
import { Label, LabelWrap } from 'components/common/Form/Form';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type MobileInterface } from 'interfaces/Test/IUser';
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { useGetListWtTrigger } from 'hooks/useGetListWt';
import * as IGrid from 'aui-grid';
import { ButtonGroup } from 'components/common/Tab/Tab.styled';
import { hdoInstance } from 'apis/hdoInstance';
interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  isCarManagerOpen: boolean;
  setIsCarManagerOpen: (param: any) => void;
  setUserid: Dispatch<SetStateAction<number | ''>>;
  userId: number | '';
  queryState: any;
  refetch: () => void;
}
const gridProps: IGrid.Props = {
  width: '100%',
  headerHeights: [40], // 헤더의 높이를 지정합니다.
  rowHeight: 40, // 행의 높이를 지정합니다. 행의 높이는 20보다 작아질 수 없습니다. (즉, 행 높이 최소값은 20)
  height: 400, // 기본 지정 높이
  // autoGridHeight: true, // 삽입한 모든 데이터를 세로 스크롤 없이 출력하고 데이터에 맞게 그리드의 높이를 자동 결정할지를 지정합니다.
  rowIdField: 'id', // rowIdField 지정
  rowIdTrustMode: true, // rowId 값 신뢰 여부
  fillColumnSizeMode: true, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
  showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
  showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
  // showAutoNoDataMessage: false, // 그리드가 표현할 데이터가 존재 하지 않을 때 자동으로 메세지를 출력할지 여부를 지정합니다.
  noDataMessage: '데이터가 없습니다.', // showAutoNoDataMessage 가 true 인 경우 출력시킬 메세지를 지정합니다.
  selectionMode: 'singleRow', // 셀 선택모드를 지정합니다. 유효 속성값은 다음과 같습니다. singleCell, singleRow, multipleCells, multipleRows, none
};
export const CarManager = ({
  state,
  setState,
  isCarManagerOpen,
  setIsCarManagerOpen,
  setUserid,
  userId,
  queryState,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsCarManagerOpen(false);
  }
  const CarGrid = useRef<AUIGrid>(null);
  const { loading, error, data, getData } = useGetListWtTrigger();
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [reload, setReload] = useState({});

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (userId !== '') {
      void getData({
        url: `/vehicles?user_id=${userId}`,
      });
    }
  }, [userId, reload]);

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = CarGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      // grid.bind(
      //   IGrid.EventKind.CellDoubleClick,
      //   (event: IGrid.CellDoubleClickEvent) => {
      //     setContractorAdminData(event.item);
      //   },
      // );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.id,
              );
              return newCheckRowId;
            });
          }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          if (event.checked) {
            const dataItems = grid?.getGridData() as Array<{ id: number }>;
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );

      // 그리드 데이터 세팅
      grid.setGridData(data);
    }
  }, [loading, data]);
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'manufacturer',
      headerText: '제조사',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'type',
      headerText: '모델',
      style: 'text-center',
    },
    {
      dataField: 'year',
      headerText: '연식',
      style: 'text-center',
    },
    {
      dataField: 'numberPlate',
      headerText: '차량번호',
      style: 'text-center',
      width: 150,
    },
    {
      dataField: 'macAddr',
      headerText: 'Mac ID',
      style: 'text-center',
    },
    {
      dataField: 'usePnC',
      headerText: 'Pnc 연결',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === true ? '이용' : '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '등록일자',
      style: 'text-center',
    },
  ];
  const handleDetleteCar = async () => {
    if (checkRowId.length === 0) {
      alert('대상을 먼저 선택하세요.');
    } else {
      const dataToSend = {
        vehicleIds: checkRowId.map(String),
      };

      const isConfirmed = window.confirm('정말로 차량을 제거할까요?');
      if (isConfirmed) {
        await deleteBatchApi(
          {
            url: `/vehicles/delete-batch`,
            data: dataToSend,
          },
          setReload,
        );
        setCheckRowId([]);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '삭제되었습니다.',
          onOk() {
            setAlertModal({
              ...alertModal,
              open: false,
            });
          },
        });
      }
    }
  };
  const handleEmptyPNC = async () => {
    if (checkRowId.length === 0) {
      alert('대상을 먼저 선택하세요.');
    } else {
      const accessToken = localStorage.getItem('accessToken') ?? '';

      if (!accessToken) {
        return;
      }

      const dataToSend = {
        vehicleIds: checkRowId.map(String),
      };
      const isConfirmed = window.confirm('pnc를 해지할까요?');
      const axios = hdoInstance();
      if (isConfirmed) {
        axios
          .put(`/vehicles/update-batch`, dataToSend, {
            headers: {
              Authorization: accessToken,
            },
          })
          .then((res: any) => {
            setReload({});
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '알림',
              content: 'pnc가 해지되었습니다.',
              onOk() {
                setAlertModal({
                  ...alertModal,
                  open: false,
                });
              },
            });
            setCheckRowId([]);
          })
          .catch((err) => {
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'error',
              title: '안내',
              content:
                err?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
            });
          });
      }
    }
  };

  return (
    <Modal open={isCarManagerOpen} title="차량 관리" close={handleCloseModal}>
      <DefaultDiv>
        {/* <GridHeader between>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Label>관리자 목록</Label>
          </div>
        </GridHeader> */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button
            onClick={() => {
              void handleDetleteCar();
            }}
          >
            차량 삭제
          </Button>
          <Button
            onClick={() => {
              void handleEmptyPNC();
            }}
          >
            Pnc 해지
          </Button>
        </div>
        <AUIGrid
          ref={CarGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </DefaultDiv>
      <ModalFooter close={handleCloseModal} isOk={false} />
    </Modal>
  );
};
