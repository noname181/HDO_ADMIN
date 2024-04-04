import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import { defaultUrl } from 'apis/api.helpers';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import {
  type StateInterface,
  type UpdateStateInterface,
} from 'interfaces/ICommon';
import { AddData } from './AddData';
import { FAQContext } from './FaqPage';
import { FaqEdit } from './FaqEdit';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
// interface FaqGridProps {
//   titleInput: string;
//   cateSelected: string;
//   search?: boolean;
// }hf
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
interface FaqGridProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  settitleInput: any;
  setcateSelected: any;
  setFaqId: Dispatch<SetStateAction<number | ''>>;
  FaqId: number | '';
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}

export const FaqGrid = ({
  loading,
  data,
  state,
  setState,
  setcateSelected,
  settitleInput,
  setFaqId,
  FaqId,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: FaqGridProps) => {
  const faqContext = useContext(FAQContext);
  const myGrid = useRef<AUIGrid>(null);

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

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
    selectionMode: 'multipleRows',
  };
  // 그리드 이벤트 세팅
  const setupGridEvents = () => {
    const grid = myGrid.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });

    // 그리드 cellClick, headerClick 이벤트 바인딩
    grid.bind(
      [IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick],
      (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
        // console.log(event);
      },
    );
  };

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/faq?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}&category=${queryState.category}`;

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
  // useEffect(() => {
  //   console.log('SampleDefault 마운트됨');
  //   // 최초 마운팅 될 때 그리드 이벤트 세팅
  //   setupGridEvents();
  //   // 최초 마운팅 될 때 그리드 데이터 조회시키기
  //   requestGridData();
  //   return () => {
  //     console.log('SampleDefault 언마운트됨');
  //   };
  // }, []);
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;
      // console.log(data);

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          // console.log(event.item);
          faqContext.setFAQData(event.item);
          setIsModalOpen(true);
          setFaqId(event.item.id);
        },
      );
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
      // 그리드 데이터 세팅
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      grid.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);
  // useEffect(() => {
  //   requestGridData();
  // }, [search]);
  // const data = [
  //   {
  //     no: 3,
  //     category: 'aaaa',
  //     title: '충전 요금 변경 안내',
  //     writer: '홍길동',
  //     date: '2023-02-31',
  //   },
  //   {
  //     no: 2,
  //     category: 'bbbb',
  //     title: '서울역(1시간), 판교 테크원타워(30분) 주차료 면..',
  //     writer: '홍길동',
  //     date: '2022-12-11',
  //   },
  //   {
  //     no: 1,
  //     category: 'cccc',
  //     title: '(일정변경)충전소 전기안전관리 점검일정 안내',
  //     writer: '홍길동',
  //     date: '2022-10-04',
  //   },
  // ];
  // 그리드 데이터 조회하여 삽입

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
      dataField: 'categoryName',
      headerText: '카테고리',
      style: 'text-center',
      width: 160,
    },
    {
      dataField: 'title',
      headerText: '제목',
      width: 'auto',
      style: 'text-center',
    },
    {
      dataField: 'createdBy',
      headerText: '작성자',
      width: 200,
      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value?.name;
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      width: 150,
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
    //       setIsModalOpen(true);
    //       setFaqId(event.item.id);
    //     },
    //   },
    // },
  ];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      faqIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/faq/delete-batch`,
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
  // useEffect(() => {
  //   console.log(checkRowId);
  // }, [checkRowId]);
  return (
    <>
      <GridButton label="FAQ" myGrid={myGrid} onDelete={handleDeleteRow}>
        <AddData
          state={state}
          setState={setState}
          setcateSelected={setcateSelected}
          settitleInput={settitleInput}
        />
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <FaqEdit
        state={state}
        setState={setState}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setFaqId={setFaqId}
        FaqId={FaqId}
      />
    </>
  );
};
export default FaqGrid;
