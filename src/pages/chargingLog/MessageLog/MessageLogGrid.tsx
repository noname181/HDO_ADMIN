import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import moment from 'moment';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import dayjs from 'dayjs';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
interface MessageLogGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setMessageLogId: Dispatch<SetStateAction<number | ''>>;
  messageType: string;
  dataAll: any;
}
export const MessageLogGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
  setIsEditOpen,
  setMessageLogId,
  messageType,
  dataAll,
}: MessageLogGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const firstdate = moment().startOf('month').format('YYYY-MM-DD');
  const lastdate = moment().endOf('month').format('YYYY-MM-DD');
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    rowIdField: 'id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
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
    // showRowCheckColumn: true,
    selectionMode: 'multipleRows',
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/messageLogs?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&endDateCreate=${queryState.endDateCreate}&startDateCreate=${queryState.startDateCreate}&returnType=${queryState.returnType}&division=${queryState.division}&messageType=${messageType}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        grid.appendData(data2);
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
        return value - _rowIndex;
      },
    },
    {
      dataField: 'messageType',
      headerText: '구분',
      width: '8%',
      minWidth: 150,
      visible: messageType === 'MESSAGE' ?? false,
    },
    {
      dataField: 'csUser',
      headerText: '발신번호',
      width: '8%',
      minWidth: 150,
      visible: false,
      labelFunction(_rowIndex, _columnIndex, value) {
        let csUser = '';
        if (value?.phoneNo.trim().length > 0) {
          csUser = value?.phoneNo;
        } else {
          csUser = 'system';
        }
        return csUser;
      },
    },
    {
      dataField: 'phoneNo',
      headerText: '수신번호',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'textMessage',
      headerText: '내용',
      width: 'auto',
      minWidth: 50,
      style: 'text-left',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'csUser',
      headerText: '발신자',
      width: '8%',
      minWidth: 150,
      visible: messageType === 'MESSAGE' ?? false,

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name && value?.accountId
          ? String(value?.name) + '(' + String(value?.accountId) + ')'
          : String(value?.name);
      },
    },
    {
      dataField: 'csUser',
      headerText: '발신자',
      width: '10%',
      labelFunction(_rowIndex, _columnIndex, value) {
        let show = '';
        if (value?.name.trim().length > 0) {
          show = String(value?.name) + `(  ${String(value?.email)} )`;
        } else {
          show = '시스템';
        }
        return show;
      },
    },
    // {
    //   dataField: 'createdAt',
    //   headerText: '등록일시',
    //   width: '8%',
    //   minWidth: 150,
    //
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'sendDt',
      headerText: '전송일시',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'returnType',
      headerText: '전송결과',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        let show = '';
        if (value === 'S') {
          show = '성공';
        } else {
          show = '실패';
        }
        return show ?? '-';
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
    //       setIsEditOpen(true);
    //       setMessageLogId(event.item.id);
    //     },
    //   },
    // },
  ];

  // 그리드 이벤트 세팅
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      // console.log(data);
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setIsEditOpen(true);
          setMessageLogId(event.item.id);
        },
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
            setCheckRowId(dataItems?.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      const data3 = data?.map((item: any) => {
        // 새 객체를 생성하기 전에 조건을 검사합니다.
        if (item.csId === null) {
          item.messageType = 'SYSTEM';
        } else if (item.chargerId === null) {
          item.messageType = 'CS';
        }

        // 조건에 따라 수정된 item을 반환합니다.
        return {
          ...item,
          totalCount: totalCount,
        };
      });
      // 그리드 데이터 세팅
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);

  return (
    <>
      <GridButton
        label={messageType === 'MESSAGE' ? '문자 내역관리' : '알림톡 내역관리'}
        myGrid={myGrid}
      >
        <div
          style={{
            display: 'flex',
            marginRight: '50px',
          }}
        >
          <div>
            조회기간: {firstdate} ~ {lastdate}
          </div>
          {messageType === 'MESSAGE' ? (
            <>
              <div style={{ marginLeft: '50px' }}>
                총 발송 건수: {dataAll?.totalMessageLogsInMonth || 0} 건
              </div>

              <div style={{ marginLeft: '50px' }}>
                CS: {dataAll?.totalCSMessageLogsInMonth || 0} 건
              </div>
              <div style={{ marginLeft: '50px' }}>
                시스템: {dataAll?.totalSystemMessageLogsInMonth || 0} 건
              </div>
            </>
          ) : (
            <div style={{ marginLeft: '50px' }}>
              총 발송 건수: {data?.length || 0} 건
            </div>
          )}
        </div>
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
export default MessageLogGrid;
