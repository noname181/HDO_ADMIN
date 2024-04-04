import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  GridContainer,
  Spinner,
  AUIGridContainer,
  GridButton,
} from 'styles/style';
import { type StateInterface } from 'interfaces/ICommon';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { deleteApi } from 'apis/deleteApi';
import { hdoInstance } from 'apis/hdoInstance';
import { TemplateAdd } from './Model/TemplateAdd';
import { TemplateEdit } from './Model/TemplateEdit';
import { deleteBatchApi } from 'apis/deleteBatchApi';

interface iProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}
const TemplateGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
}: iProps) => {
  const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [id, setId] = useState<'' | number>('');
  const myGrid = useRef<AUIGrid>(null);
  const columnLayout: IGrid.Column[] = [
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
        return value ? value - _rowIndex : '';
      },
    },
    {
      dataField: 'scriptType',
      headerText: '구분',
      width: 120,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value === 'MES' ? '문자' : value === 'COM' ? '스크립트' : value;
      },
    },
    {
      dataField: 'scriptCategory',
      headerText: '카테고리',
      width: 120,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'payment') {
          return '결제';
        } else if (value === 'info') {
          return '안내';
        } else if (value === 'announce') {
          return '공지';
        } else {
          return '-';
        }
      },
    },
    {
      dataField: 'scrptContent',
      headerText: '내용 ',
    },
    {
      dataField: 'scriptComment',
      headerText: '설명',
      width: 200,
    },
    {
      dataField: 'createdBy',
      headerText: '작성자',
      width: 120,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name ?? '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      width: 160,
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: false, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    enableColumnResize: false, // 칼럼 리사이징 가능 여부를 지정합니다.
    showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows', // singleCell or multipleRows
    rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
      if (item.isUsed) {
        return false;
      }
      return true;
    },
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});

      // 그리드 셀클릭 이벤트 바인딩
      // TODO 흠.. 헤더쪽 스타일은 cellClick 이후에 실행되어서 한박자 느리게 보임
      let previousColumnIndex: number | null = null;
      grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
        if (previousColumnIndex !== null) {
          grid.setColumnProp(previousColumnIndex, { headerStyle: '' });
        }
        grid.setColumnProp(event.columnIndex, {
          headerStyle: 'select-header',
        });
        previousColumnIndex = event.columnIndex;
      });

      // 그리드 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setId(event?.item?.id);
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
    }
  }, [data, loading]);

  async function onDeleteRow() {
    const dataToSend = {
      ids: checkRowId,
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/ms-template/delete-batch`,
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

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/ms-template?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&category=${queryState.category}`;
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
        console.log(error);
      });
  };
  return (
    <>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton
          label="템플릿 목록"
          myGrid={myGrid}
          onDelete={handleDeleteRow}
        >
          <TemplateAdd state={state} setState={setState} />
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
        <TemplateEdit state={state} setState={setState} id={id} setId={setId} />
      </GridContainer>
    </>
  );
};
export default TemplateGridTable;
