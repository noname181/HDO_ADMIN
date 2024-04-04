import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../../AUI/AUIGrid-React/AUIGridReact';
import { GridContainer } from 'styles/style';
import styled, { css } from 'styled-components';
import { DTitle, DSeeMore, DRow, DArrowRight } from './styled';
const SampleDefault = () => {
  // 그리드 객체
  const myGrid = useRef<AUIGrid>(null);
  const myGrid2 = useRef<AUIGrid>(null);
  // 그리드 칼럼 레이아웃 정의
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'no',
      headerText: '번호',
      style: 'text-center',
    },
    {
      dataField: 'title',
      headerText: '제목',
      style: 'text-center',
    },
    {
      dataField: 'writer',
      headerText: '작성자',
      style: 'text-center',
    },
    {
      dataField: 'date',
      headerText: '생성일',
      dataType: 'date',
      style: 'text-center',
    },
    {
      dataField: 'views',
      headerText: '조회수',
      style: 'text-center',
    },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'no',
      headerText: '번호',
      style: 'text-center',
    },
    {
      dataField: 'title',
      headerText: '제목',
      style: 'text-center',
    },
    {
      dataField: 'writer',
      headerText: '작성자',
      style: 'text-center',
    },
    {
      dataField: 'date',
      headerText: '생성일',
      dataType: 'date',
      style: 'text-center',
    },
    {
      dataField: 'views',
      headerText: '조회수',
      style: 'text-center',
    },
  ];
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 260,
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
  };
  useEffect(() => {
    // console.log('SampleDefault 마운트됨');
    // 최초 마운팅 될 때 그리드 이벤트 세팅
    setupGridEvents();
    // 최초 마운팅 될 때 그리드 데이터 조회시키기
    requestGridData();
    // return () => {
    //   console.log('SampleDefault 언마운트됨');
    // };
  }, []);
  // 그리드 이벤트 세팅
  const setupGridEvents = () => {
    const grid = myGrid.current as AUIGrid;
    const grid2 = myGrid2.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });
    grid2.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });
    // 그리드 cellClick, headerClick 이벤트 바인딩
    grid.bind(
      [IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick],
      (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
        // console.log(event);
      },
    );
    grid2.bind(
      [IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick],
      (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
        // console.log(event);
      },
    );
  };
  const data = [
    {
      no: 3,
      title: '충전 요금 변경 안내',
      writer: '홍길동',
      date: '2023-02-31',
      views: '1032',
    },
    {
      no: 2,
      title: '서울역(1시간), 판교 테크원타워(30분) 주차료 면..',
      writer: '홍길동',
      date: '2022-12-11',
      views: '765',
    },
    {
      no: 1,
      title: '(일정변경)충전소 전기안전관리 점검일정 안내',
      writer: '홍길동',
      date: '2022-10-04',
      views: '102',
    },
  ];
  const data2 = [
    {
      no: 5,
      title: '(4월 이벤트)현대자증권 제휴 이벤트',
      writer: '홍길동',
      date: '2023-04-15',
      views: '2102',
    },
    {
      no: 4,
      title: '도심 충전소 인증샷 이벤트',
      writer: '홍길동',
      date: '2023-02-01',
      views: '765',
    },
    {
      no: 3,
      title: '(1월 이벤트)공식 채널 팔로우 이벤트',
      writer: '홍길동',
      date: '2023-01-18',
      views: '102',
    },
  ];
  // 그리드 데이터 조회하여 삽입
  const requestGridData = () => {
    const grid = myGrid.current as AUIGrid;
    const grid2 = myGrid2.current as AUIGrid;
    grid2.showAjaxLoader();
    grid2.showAjaxLoader();
    // axios
    //   .get('./assets/data/normal_100.json')
    //   .then((result) => {
    //     grid.setGridData(result.data);
    //     grid.removeAjaxLoader();
    //   })
    //   .catch(function (error) {
    //     console.log(error.toJSON());
    //   });
    grid.setGridData(data);
    grid.removeAjaxLoader();
    grid2.setGridData(data);
    grid2.removeAjaxLoader();
  };

  return (
    <GridContainer height="auto" minHeight="260px">
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', paddingRight: '10px' }}>
          <DRow>
            <DTitle>공지사항</DTitle>
            <DRow>
              <DSeeMore>더보기</DSeeMore>
              <DArrowRight></DArrowRight>
            </DRow>
          </DRow>
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </div>
        <div style={{ width: '50%', paddingLeft: '10px' }}>
          <DRow>
            <DTitle>프로모션</DTitle>
            <DRow>
              <DSeeMore>더보기</DSeeMore>
              <DArrowRight></DArrowRight>
            </DRow>
          </DRow>
          <AUIGrid
            ref={myGrid2}
            columnLayout={columnLayout2}
            gridProps={gridProps}
          />
        </div>
      </div>
    </GridContainer>
  );
};
export default SampleDefault;
