import { useEffect, useRef, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
// import dayjs from 'dayjs';
import {
  GridContainer,
  Spinner,
  GridButton,
  AUIGridContainer,
} from 'styles/style';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { category } from 'utils/stationUtils';
import { RegisterCoporation } from './RegisterCoporation';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const MobileUserGridTable = ({
  loading,
  data,
  state,
  setState,
  setUserid,
  setIsEditOpen,
  setIsRegistCoporation,
  isRegistCoporation,
  refetch,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: any) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const MobileUserGrid = useRef<AUIGrid>(null);

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
        return value ? value - _rowIndex : '-';
      },
    },
    {
      dataField: 'status',
      headerText: '이용유무',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'ACTIVE' ? '이용' : '중지';
      },
    },
    // {
    //   dataField: 'Org',
    //   headerText: '구분',
    //   width: 150,
    //   labelFunction(
    //     _rowIndex,
    //     _columnIndex,
    //     value,
    //     _headerText,
    //     _item,
    //     _dataField,
    //     _cItem,
    //   ) {
    //     return _item?.Org?.id !== 1 ? category(value?.category) : '-';
    //   },
    // },
    // {
    //   dataField: 'Org',
    //   headerText: '소속명',
    //   width: 150,
    //   labelFunction(
    //     _rowIndex,
    //     _columnIndex,
    //     value,
    //     _headerText,
    //     _item,
    //     _dataField,
    //     _cItem,
    //   ) {
    //     return _item?.Org?.id !== 1 ? value?.name : '-';
    //   },
    // },
    {
      dataField: 'name',
      headerText: '이름',
      width: 150,
    },
    {
      dataField: 'accountId',
      headerText: '유저 ID',
      width: 150,
    },
    {
      dataField: 'phoneNo',
      headerText: '전화번호',
      width: 120,

      // labelFunction(_rowIndex, _columnIndex, value) {
      //   const result =
      //     (value?.substr(0, 3) as string) +
      //     '-' +
      //     (value?.substr(3, 4) as string) +
      //     '-' +
      //     (value?.substr(7) as string);
      //   return value ? result : '-';
      // },
    },
    {
      dataField: 'email',
      headerText: '이메일',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value || '-';
      },
    },

    {
      dataField: 'createdAt',
      headerText: '가입일',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },

    // {
    //   // TODO DB준비되면 변경
    //   dataField: 'payMethodId',
    //   headerText: '결제수단',
    //   width: '5%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value || '-';
    //   },
    // },
    // {
    //   // TODO DB준비되면 변경
    //   dataField: 'www',
    //   headerText: '차량등록',
    //   width: '5%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value || '-';
    //   },
    // },
    // {
    //   dataField: 'Vehicles',
    //   headerText: 'PNC등록',
    //   width: '5%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value?.usePnC || '-';
    //   },
    // },
    // {
    //   dataField: 'currentAccessDateTime',
    //   headerText: '최근접속',
    //   width: '8%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value;
    //   },
    // },
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
    //       console.log(event);
    //       setIsEditOpen(true);
    //       setUserid(event.item.id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    editable: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'multipleRows',
    showRowCheckColumn: true,
  };

  const requestAddData = async () => {
    const grid = MobileUserGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/web/users?userType=mobile&rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&org=${queryState.category}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log('result::', result);

        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data2);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
          content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
      });
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = MobileUserGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setIsEditOpen(true);
          setUserid(event.item.id);
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
      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
          // console.log(event);
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
      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // console.log(data2);
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      ids: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/web/users`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     alert(error);
        //   }
        // },
      );
      setCheckRowId([]);
    }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }
  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton
        label="모바일 회원"
        myGrid={MobileUserGrid}
        onDelete={handleDeleteRow}
      >
        {/* <RegisterCoporation
          setIsRegistCoporation={setIsRegistCoporation}
          isRegistCoporation={isRegistCoporation}
          state={state}
          setState={setState}
          refetch={refetch}
        /> */}
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={MobileUserGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};

export default MobileUserGridTable;
