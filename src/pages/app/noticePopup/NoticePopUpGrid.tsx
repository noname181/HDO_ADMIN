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
import { AddData } from './AddData';
import { NoticePopUpContext } from './NoticePopUpPage';
import { Button } from 'components/common/Button/Button';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import dayjs from 'dayjs';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { NoticePopUpEdit } from './NoticePopUpEdit';
interface NoticePopUpGridTableProps {
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
export const NoticePopUpGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: NoticePopUpGridTableProps) => {
  const NoticepopUpContext = useContext(NoticePopUpContext);
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [NoticePopUpId, setNoticePopUpId] = useState<number | ''>('');

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
    showRowCheckColumn: true,
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
    const url = `/v1/web/notice?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&title=${queryState.title}&active=${queryState.exposure}&firstDate=${queryState.startDate}&lastDate=${queryState.endDate}`;

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
      dataField: 'title',
      headerText: '제목',
      width: 'auto',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'type',
      headerText: '유형',
      width: 'auto',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'isActive',
      headerText: '노출여부',
      width: '100',
      style: 'text-center',
      labelFunction: (_rowIndex, _columnIndex, value) => {
        switch (value) {
          case 'Y':
            return '노출';
          case 'N':
            return '비노출';
          default:
            return '';
        }
      },
    },
    {
      dataField: '',
      headerText: '노출기간',
      width: 400,
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
        return String(_item?.firstDate) + ' - ' + String(_item?.lastDate);
      },
    },

    {
      dataField: 'createdAt',
      headerText: '등록일',
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
    //   dataField: 'image',
    //   headerText: '리스트 배너',
    //   style: 'text-center',

    //   renderer: {
    //     type: IGrid.RendererKind.ImageRenderer,
    //     altField: '',
    //     imgHeight: 30,
    //   },
    //   width: 100,
    // },
    {
      dataField: 'createdBy',
      headerText: '작성자',
      style: 'text-center',

      width: 200,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return (
          String(value?.name) + ' ( ' + String(value?.accountId) + ' ) ' ?? '-'
        );
      },
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

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          // console.log(event.item);
          NoticepopUpContext.setNoticePopUpData(event.item);
          setNoticePopUpId(event.item.id);
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
      const data3 = data?.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));

      // 그리드 데이터 세팅
      grid?.setGridData(data3);
      // console.log(data);
    }
  }, [loading, data]);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      noticeIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/web/notice/delete-batch`,
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
      <GridButton label="목록" myGrid={myGrid} onDelete={handleDeleteRow}>
        <AddData state={state} setState={setState} />
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <NoticePopUpEdit
        state={state}
        setState={setState}
        NoticePopUpId={NoticePopUpId}
        setNoticePopUpId={setNoticePopUpId}
      />
    </>
  );
};
export default NoticePopUpGrid;
