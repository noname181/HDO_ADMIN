import { useEffect, useRef, useContext, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import dayjs from 'dayjs';
import { TabsContext } from 'components/common/Tab/Tabs';
import { AUIGridContainer, DefaultDiv, GridHeader } from 'styles/style';
import { useGetListWtTrigger } from 'hooks/useGetListWt';
import { Button } from 'components/common/Button/Button';
import { Label } from 'components/common/Form/Form';
import { postApi } from 'apis/postApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import ContractorAdminEdit from './ContractorAdminEdit';

const gridProps: IGrid.Props = {
  width: '100%',
  headerHeights: [40], // 헤더의 높이를 지정합니다.
  rowHeight: 40, // 행의 높이를 지정합니다. 행의 높이는 20보다 작아질 수 없습니다. (즉, 행 높이 최소값은 20)
  height: 200, // 기본 지정 높이
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

const ContractorAdminWaitGrid = ({
  contractorData,
  state,
  setState,
  isModalOpen,
}: any) => {
  const context = useContext(TabsContext);
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } = useGetListWtTrigger();
  const [contractorAdminData, setContractorAdminData] = useState('');
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  useEffect(() => {
    if (contractorData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/web/orgs/${contractorData.id}/users/external/request`,
      });
    }
  }, [contractorData]);
  useEffect(() => {
    if (state.isSuccess) {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/web/orgs/${contractorData.id}/users/external/request`,
      });
    }
  }, [state]);
  // 그리드 객체
  const contractorWaitGrid = useRef<AUIGrid>(null);

  // 드랍다운리스트의 리스트들
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'status',
      headerText: '이용유무',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'ACTIVE' ? '이용' : '중지';
      },
    },
    {
      dataField: 'name',
      headerText: '이름',
      style: 'text-center',
    },
    {
      dataField: 'role',
      headerText: '권한',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name ?? '-';
      },
    },
    {
      dataField: 'phoneNo',
      headerText: '전화',
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   // 전화번호 마스킹 처리 로직
      //   const dash = value?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      //   return dash;
      // },
      width: 150,
    },
    {
      dataField: 'email',
      headerText: '이메일',
      style: 'text-center',
    },
    {
      dataField: 'verifyEmailSendedAt',
      headerText: '최근전송일',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return dayjs(value).format('YYYY-MM-DD');
        } else {
          return '-';
        }
      },
    },
    // {
    //   dataField: 'edit',
    //   headerText:
    //     '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
    //   width: '4%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.IconRenderer,
    //     iconWidth: 18,
    //     iconHeight: 18,
    //     iconTableRef: {
    //       default: './assets/img/icon/icon-edit.png',
    //     },
    //     onClick: function (event) {
    //       setContractorAdminData(event.item);
    //     },
    //   },
    // },
  ];

  // Tab 그리드 리사이즈
  useEffect(() => {
    if (context.selectedIndex === '2') {
      const grid = contractorWaitGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);

  // 그리드 데이터 세팅
  useEffect(() => {
    if (isModalOpen) {
      setCheckRowId([]);
    }
    if (!loading && data !== null) {
      const grid = contractorWaitGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 그리드 cellClick, headerClick 이벤트 바인딩
      // grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      //   // console.log(event);
      // });
      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setContractorAdminData(event.item);
        },
      );

      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          // console.log(event);
          if (event.checked) {
            setCheckRowId((value) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId((value) => {
              const newCheckRowId = value.filter(
                (item) => item !== event.item.id,
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
  // useEffect(() => {
  //   console.log(checkRowId);
  // }, [checkRowId]);
  async function onFinish() {
    if (checkRowId?.length === 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '알림',
        content: '대상을 선택하세요.',
      });
    } else {
      setIsSendingMail(true);
      const userArray = checkRowId.map((id) => ({ id }));
      const dataToSend = {
        user: userArray,
      };
      const url = `/v1/web/auth/accounts/external/approve`;
      const accessToken = localStorage.getItem('accessToken') ?? '';
      if (!accessToken) return;
      const axios = hdoInstance();
      axios
        .post(url, dataToSend, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((result) => {
          setIsSendingMail(false);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'success',
            title: '알림',
            content: '이메일이 발송되었습니다.',
          });
        })
        .catch((error) => {
          setIsSendingMail(false);
          console.log(error);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title:
              error?.response?.data?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
            content:
              error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
          });
        });
      // await postApi(
      //   {
      //     url: `/v1/web/auth/accounts/external/approve`,
      //     data: dataToSend,
      //   },
      //   setState,
      // );
      // setCheckRowId([]);
    }
  }
  function handleUpdate() {
    if (!isSendingMail) {
      void onFinish();
    }
  }
  return (
    <DefaultDiv>
      <GridHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Label>가입 대기 목록</Label>
          <Button
            onClick={() => {
              handleUpdate();
            }}
            disabled={isSendingMail}
          >
            가입 메일 전송
          </Button>
        </div>
      </GridHeader>
      <AUIGridContainer style={{ height: 200 }}>
        <AUIGrid
          ref={contractorWaitGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ContractorAdminEdit
        state={state}
        setState={setState}
        contractorAdminData={contractorAdminData}
        setContractorAdminData={setContractorAdminData}
      />
    </DefaultDiv>
  );
};

export default ContractorAdminWaitGrid;
