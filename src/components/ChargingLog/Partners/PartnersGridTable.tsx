import {
  useEffect,
  useRef,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { category } from 'utils/stationUtils';
import { chargerState } from 'utils/test/FilterSwitch';
import { areaText, branchText } from 'utils/codelookup';
import { KoreaNamePage } from 'utils/koreanamepage';
import {
  GridContainer,
  AUIGridContainer,
  Spinner,
  GridButton,
} from 'styles/style';
import { TabsContext } from 'components/common/Tab/Tabs';
import { hdoInstance } from 'apis/hdoInstance';
import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import PartnersDetailPopUp from './PartnersDetailPopUp';
import { alertModalState } from 'recoil/modalState';

interface Props {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
  refetch: any;
}
export const PartnersGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
  refetch,
}: Props) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodateData, setNoteData] = useState(null);
  const [rowNumber, setRowNumber] = useState<number>();

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
    const url = `/v1/web/userslog-list?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&searchVal=${queryState.searchVal}&searchKey=${queryState.searchKey}&devision=${queryState.division}&type=${queryState.type}`;
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
      width: '8%',
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
    // {
    //   dataField: 'createdAt',
    //   headerText: '로그 발생 일자',
    //   width: '8%',
    //   minWidth: 150,
    //   style: 'text-center',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
    //   },
    // },
    {
      dataField: 'Org',
      headerText: '구분',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value?.details);
      },
    },
    {
      dataField: 'Org',
      headerText: '부서',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name;
      },
    },
    {
      dataField: 'UsersNew',
      headerText: '아이디',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.email;
      },
    },
    {
      dataField: 'UsersNew',
      headerText: '이름',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name;
      },
    },

    // {
    //   dataField: 'UsersNew',
    //   headerText: '회원',
    //   width: '8%',
    //   minWidth: 150,
    //   style: 'text-center',
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.accountId
    //       ? String(value?.name) + '(' + String(value?.accountId) + ')'
    //       : '-';
    //   },
    // },
    {
      dataField: 'status',
      headerText: '액션',
      width: '6%',
      minWidth: 100,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        let statusShow: any = '';
        if (item?.note) {
          const statusVal = item?.note.split(',');
          if (statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'GET') {
            statusShow = '개인정보';
          } else if (
            statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'PUT'
          ) {
            statusShow = '수정';
          } else if (
            statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'POST'
          ) {
            statusShow = '등록';
          } else if (
            statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'PATCH'
          ) {
            statusShow = '수정';
          } else if (
            statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'DELETE'
          ) {
            statusShow = '삭제';
          }
        }

        switch (value) {
          case 'SUCCESS':
            return '로그인';
          case 'INFO':
            return '조회';
          case 'PRIVATE':
            return '개인정보';
          case 'EXCEL_DOWNLOAD':
            return '엑셀 다운로드';
          case 'WRITE':
            return '등록';
          case 'CREATE':
            return '등록';
          case 'EDIT':
            return '수정';
          case 'UPDATE':
            return '수정';
          case 'DELETE':
            return '삭제';
          case 'LOGOUT':
            return '로그아웃';
          default:
            return statusShow;
        }
      },
    },
    {
      dataField: 'urlPage',
      headerText: '프로그램명',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return KoreaNamePage(value, item?.status);
        // let urlpage = '';
        // if (value === '/users/logs' && item?.status === 'LOGOUT') {
        //   urlpage = '로그아웃';
        // }
        // if (
        //   value === '/v1/web/auth/external/login' &&
        //   item?.status === 'SUCCESS'
        // ) {
        //   urlpage = '로그인';
        // }
        // if (value === '/v1/web/auth/hdo/login' && item?.status === 'SUCCESS') {
        //   urlpage = '로그인';
        // }
        // switch (value) {
        //   case '/':
        //     return '대시보드';
        //   case '/v1/web/auth/external/login':
        //     return urlpage;
        //   case '/v1/web/auth/hdo/login':
        //     return urlpage;
        //   case '/users/logs':
        //     return urlpage;
        //   case '/codelookup':
        //     return '공통코드 관리';
        //   case '/parameter':
        //     return 'Parameter 관리';
        //   case '/error-code':
        //     return 'Errorcode 조회';
        //   case '/charger-model':
        //     return '충전기 모델 관리';
        //   case '/update-file':
        //     return '충전기 전송파일 관리';
        //   case '/permission-admin':
        //     return '권한관리';
        //   case '/station':
        //     return '사업장 관리';
        //   case '/contractor':
        //     return '협력사 관리';
        //   case '/client':
        //     return '고객사 관리';
        //   case '/mobile-user':
        //     return '모바일 회원';
        //   case '/admin':
        //     return 'HDO 관리자';
        //   case '/external-admin':
        //     return '외부 관리자';
        //   case '/charging-station':
        //     return '충전소';
        //   case '/charger':
        //     return '충전기 관리';
        //   case '/charging-unit-price':
        //     return '단가테이블';
        //   case '/charger-update':
        //     return '충전기 업데이트';
        //   case '/trouble-report':
        //     return '고장 신고 관리';
        //   case '/charger-history':
        //     return '충전내역';
        //   case '/payment-history':
        //     return '충전 결제 내역';
        //   case '/payment-details':
        //     return '결제내역';
        //   case '/outstanding-payment':
        //     return '미결제 내역';
        //   case '/reservation':
        //     return '충전 결제 내역';
        //   case '/unexported-payment':
        //     return '미출차 결제 내역';
        //   case '/bonus-card':
        //     return '멤버쉽';
        //   case '/point':
        //     return '포인트';
        //   case '/car-wash':
        //     return '세차권';
        //   case '/coupon':
        //     return '쿠폰';
        //   case '/added-service-stats':
        //     return '통계';
        //   case '/settlement':
        //     return '일매출관리';
        //   case '/daily-payment':
        //     return '일수금관리';
        //   case '/monthly-settlement':
        //     return '월정산관리';
        //   case '/notice-popup':
        //     return '공지 팝업';
        //   case '/notice':
        //     return '공지사항';
        //   case '/faq':
        //     return 'FAQ';
        //   case '/banner-event':
        //     return '배너/이벤트';
        //   case '/terms-policy':
        //     return '정책 및 약관';
        //   case '/inquiry':
        //     return '1:1문의';
        //   case '/review':
        //     return '리뷰';
        //   case '/cs-main':
        //     return 'CS';
        //   case '/cs-home':
        //     return 'CS';
        //   case '/consultation':
        //     return '상담 내역';
        //   case '/as-consultation':
        //     return 'CS';
        //   case '/template':
        //     return '템플릿 관리';
        //   case '/cs-dashboard':
        //     return 'CS 대시보드';
        //   case '/statistics':
        //     return '통계';
        //   case '/charger-status-history':
        //     return '충전기 상태 내역';
        //   case '/charger-error-history':
        //     return '충전기 오류 로그';
        //   // case '/log-history':
        //   //   handelLogoutPermission(
        //   //     user?.role?.chargingLogs?.permissions,
        //   //     '유저 데이터 로그',
        //   //   );
        //   //
        //   case '/message-log':
        //     return '알림톡 내역관리';
        //   case '/log':
        //     return '유저 데이터 로그';
        //   case '/batch-log':
        //     return '배치 로그';
        //   case '/charger-diagnostic':
        //     return '충전기 진단정보 ';
        //   case '/config-log':
        //     return '콘솔로그';
        //   case '/charging-log':
        //     return '충전로그';
        //   default:
        //     return '';
        // }
      },
    },
    {
      dataField: 'urlPage',
      headerText: 'URL',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'ipAddress',
      headerText: 'ip',
      width: '4%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      width: '8%',
      minWidth: 150,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    // {
    //   dataField: '',
    //   headerText: '기기 정보',
    //   width: '6%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '-';
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
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setIsModalOpen(true);
          setRowNumber(event.item.totalCount - Number(event.rowIndex));
          setNoteData(event?.item);
        },
      );
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);

  return (
    <>
      <GridButton label="유저 데이터 로그" myGrid={myGrid}></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <PartnersDetailPopUp
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={nodateData}
        refetch={refetch}
        rowNumber={rowNumber}
      ></PartnersDetailPopUp>
    </>
  );
};
