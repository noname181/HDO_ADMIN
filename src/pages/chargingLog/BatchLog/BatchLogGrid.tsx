import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { postApi } from 'apis/postApi';
import { boolean } from 'utils/test/FilterSwitch';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface BatchLogGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}
export const BatchLogGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: BatchLogGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
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
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/web/batch-log?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&division=${queryState.division}&status=${queryState.status}`;
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
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',

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
      dataField: 'data_day',
      headerText: '데이터 발생일',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        const stringValue =
          typeof value === 'number' ? value.toString() : value;
        const year = stringValue.slice(0, 4);
        const month = stringValue.slice(4, 6).padStart(2, '0');
        const day = stringValue.slice(6, 8).padStart(2, '0');
        const formattedString = `${String(year)}-${String(month)}-${String(
          day,
        )}`;

        return formattedString;
      },
    },
    {
      dataField: 'data_time',
      headerText: '배치 요청 일시',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
    },
    {
      dataField: 'data_gubun',
      headerText: '구분',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'USER') {
          return 'HDO 회원';
        } else if (value === 'STATION') {
          return '충전소';
        } else if (value === 'SITE') {
          return '주유소';
        } else if (value === 'KICC') {
          return '매출정산';
        } else if (value === 'DEPOSIT') {
          return '수금';
        } else {
          return value;
        }
      },
    },
    {
      dataField: 'data_results',
      headerText: '상태',
      width: '4%',
      minWidth: 50,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'S') {
          return '성공';
        } else {
          return '실패';
        }
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
      //   if (value === 'S') {
      //     return `<div style="display:flex;justify-content:center">성공</div>`;
      //   } else {
      //     return '<div class="aui-grid-button-renderer aui-grid-button-percent-width">재시도</div>';
      //   }
      // },
    },
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
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      const datafake = [];

      for (let i = 15; i > 0; i--) {
        datafake.push({
          d1: i,
          d2: '2023.11.01 11:11:00',
          d3: 'HDO 회원',
          d4: '성공',
        });
      }
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);
  async function onRetryUsers() {
    setIsLoading(true);
    const url = `/v1/ws/users`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        },
      )
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.response?.data?.errorCode ?? '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        setIsLoading(false);
      });
  }
  async function onRetrySites() {
    setIsLoading(true);
    const url = `/v1/ws/sites`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        },
      )
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.response?.data?.errorCode ?? '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        setIsLoading(false);
      });
  }
  async function onRetryStations() {
    setIsLoading(true);
    const url = `/v1/ws/stations`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        },
      )
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.response?.data?.errorCode ?? '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        setIsLoading(false);
      });
  }

  async function onRetryBank(date: string) {
    setIsLoading(true);
    const url = `/v1/ws/SalesService`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(
        url,
        { data_day: date },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      )
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.response?.data?.errorCode ?? '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        setIsLoading(false);
      });
  }
  async function onRetrySettlement(date: string) {
    setIsLoading(true);
    const url = `/v1/ws/DepositService`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(
        url,
        { data_day: date },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      )
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setState({ ...state, isLoading: false, isSuccess: false });
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.response?.data?.errorCode ?? '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        setIsLoading(false);
      });
  }
  function handleRetryUsers() {
    void onRetryUsers();
  }
  function handleRetrySites() {
    void onRetrySites();
  }
  function handleRetryStations() {
    void onRetryStations();
  }
  function handleRetryBank() {
    let date = today;
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '알림',
      content: (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <p>매출 정산 날짜 :</p>
            <div style={{ position: 'relative' }}>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                defaultValue={dayjs(date)}
                onChange={(value) => {
                  date = dayjs(value).format('YYYY-MM-DD');
                }}
              />
            </div>
            {/* <p>변경</p> */}
          </div>
          <div>해당 날짜의 정산내역을 재수신하시겠습니까?</div>
        </div>
      ),
      cancelText: '취소',
      okText: '확인',
      onOk() {
        void onRetryBank(date);
      },
    });
  }
  function handleRetrySettlement() {
    let date = today;
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '알림',
      content: (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <p>펌뱅킹 수금 날짜 :</p>
            <div style={{ position: 'relative' }}>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                defaultValue={dayjs(date)}
                onChange={(value) => {
                  date = dayjs(value).format('YYYY-MM-DD');
                  // console.log(dayjs(value).format('YYYY-MM-DD'));
                }}
              />
            </div>
            {/* <p>변경</p> */}
          </div>
          <div>해당 날짜의 수금내역을 재수신하시겠습니까?</div>
        </div>
      ),
      cancelText: '취소',
      okText: '확인',
      onOk() {
        void onRetrySettlement(date);
      },
    });
  }

  return (
    <>
      <GridButton label="로그 내역" myGrid={myGrid}>
        <div
          style={{
            display: 'flex',
            marginRight: '50px',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '10px' }}>HDO 회원 정보: 30분 마다</div>
          <Button size="md" color="primary" onClick={handleRetryUsers}>
            재시도
          </Button>
          <div
            style={{
              marginLeft: '50px',
              marginRight: '10px',
            }}
          >
            주유소정보: 매일 새벽 1시
          </div>
          <Button size="md" color="primary" onClick={handleRetrySites}>
            재시도
          </Button>
          <div
            style={{
              marginLeft: '50px',
              marginRight: '10px',
            }}
          >
            충전소 정보: 매일 새벽 1시30분
          </div>
          <Button size="md" color="primary" onClick={handleRetryStations}>
            재시도
          </Button>

          <div
            style={{
              marginLeft: '50px',
              marginRight: '10px',
            }}
          >
            매출정산 정보 : 새벽 2시
          </div>
          <Button size="md" color="primary" onClick={handleRetryBank}>
            재시도
          </Button>
          <div
            style={{
              marginLeft: '50px',
              marginRight: '10px',
            }}
          >
            펌뱅킹 수금 : 새벽 4시
          </div>
          <Button size="md" color="primary" onClick={handleRetrySettlement}>
            재시도
          </Button>
        </div>
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {(loading || isLoading) && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
export default BatchLogGrid;
