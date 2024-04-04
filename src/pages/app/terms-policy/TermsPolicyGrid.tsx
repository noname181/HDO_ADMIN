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
import { TermsPolicyContext } from './TermsPolicyPage';
import { TermsPolicyEdit } from './TermsPolicyEdit';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
// interface TermsPolicyGridProps {
//   titleInput: string;
//   cateSelected: string;
//   search?: boolean;
// }hf
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface TermsPolicyGridProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  settitleInput: any;
  setcateSelected: any;
  setTermsPolicyId: Dispatch<SetStateAction<number | ''>>;
  TermsPolicyId: number | '';
  totalCount: number;
  queryState: any;
  setQueryState: Dispatch<SetStateAction<any>>;
  setCheckRowId: any;
  checkRowId: any;
}

export const TermsPolicyGrid = ({
  loading,
  data,
  state,
  setState,
  setcateSelected,
  settitleInput,
  setTermsPolicyId,
  TermsPolicyId,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: TermsPolicyGridProps) => {
  const termsPolicyContext = useContext(TermsPolicyContext);
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
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/terms?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}`;

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
        // console.log(data);
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
          termsPolicyContext.setTermsPolicyData(event.item);
          setIsModalOpen(true);
          setTermsPolicyId(event.item.id);
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
      // 그리드 데이터 세팅
      grid.setGridData(data2);
      // console.log(data);
    }
  }, [loading, data]);

  const requestGridData = () => {
    const grid = myGrid.current as AUIGrid;
    const apiUrl = `/terms`;

    grid.setGridData(data);
    grid.removeAjaxLoader();
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
      dataField: 'category',
      headerText: '카테고리',
      width: 100,
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
        return value ?? '-';
      },
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
        return value?.name;
      },
    },
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
    //       setTermsPolicyId(event.item.id);
    //     },
    //   },
    // },
  ];
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      termIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/term/delete-batch`,
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
    <>
      <GridButton
        label="정책 및 약관"
        myGrid={myGrid}
        onDelete={handleDeleteRow}
      >
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
      <TermsPolicyEdit
        state={state}
        setState={setState}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setTermsPolicyId={setTermsPolicyId}
        TermsPolicyId={TermsPolicyId}
      />
    </>
  );
};
export default TermsPolicyGrid;
