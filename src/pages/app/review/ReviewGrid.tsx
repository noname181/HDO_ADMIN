import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import dayjs from 'dayjs';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
interface StationGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setReviewId: Dispatch<SetStateAction<number | ''>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}

const ReviewGrid = ({
  loading,
  data,
  state,
  setState,
  setIsEditOpen,
  setReviewId,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: StationGridTableProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [reviewData, setReviewData] = useState('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
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
      dataField: 'areaName',
      headerText: '부문',
      style: 'text-center',
    },
    {
      dataField: 'stat_type',
      headerText: '구분',
      width: '5%',
      minWidth: 90,
      style: 'text-center',
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      style: 'text-center',
    },
    {
      dataField: 'chgs_station_id',
      headerText: '충전소 ID',
      style: 'text-center',

      minWidth: 50,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ?? '123';
      // },
    },
    {
      dataField: 'chgs_name',
      headerText: '충전소명',
      width: '5%',
      style: 'text-center',

      minWidth: 50,
    },
    // {
    //   dataField: 'chg_charger_id',
    //   headerText: '충전기 ID',
    //   style: 'text-center',

    //   width: '7%',
    //   minWidth: 50,
    //   // labelFunction(_rowIndex, _columnIndex, value) {
    //   //   return value ?? '1012-경기1';
    //   // },
    // },
    {
      dataField: 'stars',
      headerText: '평점',
      width: 'auto',
      minWidth: 50,
      style: 'text-center',
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          // 엑셀, PDF 등 내보내기 시 값 가공 함수
          return value;
        },
      },
      labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
        // const myVariable: any = [];
        // const myArray = myVariable as string[];
        // for (let i = 0; i < value; i++) {
        //   myArray.push(i);
        // }
        // console.log(myArray);
        // HTML 템플릿 작성
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        let stars = '';
        for (let i = 0; i < value; i++) {
          stars += `<img
            key={item.num}
            src="./assets/img/icon/Vector.png"
            alt="star"
            style="margin-right: 4px; height: 10px;"
          />`;
        }
        if (value < 5) {
          for (let x = value; x < 5; x++) {
            stars += `<img
              key={item.num}
              src="./assets/img/icon/VectorGrey.png"
              alt="star"
              style="margin-right: 4px; height: 10px;"
            />`;
          }
        }
        return value ? stars : '';
      },
    },
    {
      dataField: 'content',
      headerText: '내용',
      width: 'auto',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'accountId',
      headerText: '유저 ID',
      style: 'text-center',
    },
    // {
    //   dataField: 'createdBy',
    //   headerText: '작성자',
    //   width: 100,
    //   labelFunction: function (
    //     _rowIndex,
    //     _columnIndex,
    //     value,
    //     _headerText,
    //     _item,
    //     _dataField,
    //     _cItem,
    //   ) {
    //     return value?.name;
    //   },
    // },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      style: 'text-center',

      width: 100,
      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return dayjs(value).format('YYYY-MM-DD');
      },
    },
    {
      dataField: 'edit',
      headerText:
        '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
      width: '4%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.IconRenderer,
        iconWidth: 18,
        iconHeight: 18,
        iconTableRef: {
          default: './assets/img/icon/icon-edit.png',
        },
        onClick: function (event) {
          setIsEditOpen(true);
          setReviewId(event.item.id);
        },
      },
    },
  ];
  // 그리드 속성 정의
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
    showRowCheckColumn: true,
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/review?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&content=${queryState.content}`;

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
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setReviewData(event.item);
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
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data3);
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
          url: `/v1/review`,
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
        label="리뷰"
        myGrid={myGrid}
        onDelete={handleDeleteRow}
      ></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
export default ReviewGrid;
