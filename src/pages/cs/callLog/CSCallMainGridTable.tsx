import React, { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { AUIGridContainer, GridContainer } from 'styles/style';
import { TableButton } from 'components/common/Button/TableButton';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { type StateInterface } from 'interfaces/ICommon';
import { userAuthState } from 'recoil/authState';
import axios from 'axios';

interface callLogFilterInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'desc' | 'asc'; // 정렬순서 default desc 내림차순 <-> asc 오름차순
  searchVal: string;
  startDate: string;
  endDate: string;
}

interface counsultantGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  queryState: callLogFilterInterface;
  setQueryState: React.Dispatch<React.SetStateAction<callLogFilterInterface>>;
}

const CSCallMainGridTable = ({
  loading,
  data,
  state,
  setState,
  queryState,
  setQueryState,
}: counsultantGridTableProps) => {
  const navigate = useNavigate();
  const myGrid = useRef<AUIGrid>(null);
  const [{ user }] = useRecoilState(userAuthState);
  /*
  agents_id
  queues_id
  call_type
  cid
  peer
  ans
  ivr
  call_result
  unique_no
  ling_sec
  call_sec
  trans_yn
  pickup_yn
  record_file
  callee_hangup_yn
  start_date
  ans_date
  wait_date
  ring_date
  end_date
  */
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'agents_id',
      headerText: 'agents_id',
      width: '80',
    },
    {
      dataField: 'queues_id',
      headerText: 'queues_id',
      width: '80',
    },
    {
      dataField: 'call_type',
      headerText: 'call_type',
      width: '80',
    },
    {
      dataField: 'cid',
      headerText: 'cid',
      width: '150',
    },
    {
      dataField: 'peer',
      headerText: 'peer',
      width: '80',
    },
    {
      dataField: 'ans',
      headerText: 'ans',
      width: '80',
    },
    {
      dataField: 'ivr',
      headerText: 'ivr',
      width: '80',
    },
    {
      dataField: 'call_result',
      headerText: 'call_result',
      width: '80',
    },
    {
      dataField: 'unique_no',
      headerText: 'unique_no',
      width: '150',
    },
    {
      dataField: 'ling_sec',
      headerText: 'ling_sec',
      width: '80',
    },
    {
      dataField: 'call_sec',
      headerText: 'call_sec',
      width: '80',
    },
    {
      dataField: 'trans_yn',
      headerText: 'trans_yn',
      width: '80',
    },
    {
      dataField: 'pickup_yn',
      headerText: 'pickup_yn',
      width: '80',
    },
    {
      dataField: 'record_file',
      headerText: 'record_file',
      width: '300',
    },
    {
      dataField: 'callee_hangup_yn',
      headerText: 'callee_hangup_yn',
      width: '150',
    },
    {
      dataField: 'start_date',
      headerText: 'start_date',
      width: '150',
    },
    {
      dataField: 'ans_date',
      headerText: 'ans_date',
      width: '150',
    },
    {
      dataField: 'wait_date',
      headerText: 'wait_date',
      width: '150',
    },
    {
      dataField: 'ring_date',
      headerText: 'ring_date',
      width: '150',
    },
    {
      dataField: 'end_date',
      headerText: 'end_date',
      width: '150',
    },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: false, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    enableColumnResize: true, // 칼럼 리사이징 가능 여부를 지정합니다.
    showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: true, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

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
        (event: IGrid.CellDoubleClickEvent) => {},
      );

      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
          // console.log(event);
          // const rowCount = grid.getRowCount();
          // if (rowCount === totalCount) {
          //   grid.unbind(IGrid.EventKind.VScrollChange);
          //   return;
          // }
          if (event.position === event.maxPosition) {
            void requestAddData();
          }
        },
      );
      // 그리드 데이터 세팅
      grid.setGridData(data);
    }
  }, [loading, data]);

  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;
    setQueryState({
      ...queryState,
      page: queryState.page++,
    });
    let param = `?page=${queryState.page}`;
    if (queryState.searchVal.length > 0) {
      param += `&cid=${queryState.searchVal}`;
    }
    if (queryState.startDate.length > 0) {
      param +=
        '&start_date=' + encodeURIComponent(queryState.startDate + ' 00:00:00');
    }
    if (queryState.endDate.length > 0) {
      param +=
        '&end_date=' + encodeURIComponent(queryState.endDate + ' 23:59:59');
    }
    await axios
      // .get(`https://211.253.36.82:8100/api/v1/cdrs${param}`)
      .get(`https://ktapi-evnu.oilbank.co.kr:8100/api/v1/cdrs${param}`)
      .then((result: any) => {
        grid.appendData(result?.data?.item);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <GridContainer
      height={
        user?.Org.category === 'CS' && user?.Org.id !== 552
          ? 'calc(100vh - 23.3rem)'
          : 'calc(100vh - 18.8rem)'
      }
    >
      {user?.Org.category !== 'AS' && (
        <TableButton isExcel={false} label="상담 목록" />
      )}
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
export default CSCallMainGridTable;
