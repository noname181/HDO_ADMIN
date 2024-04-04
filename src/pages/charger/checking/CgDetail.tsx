import React, { useState, useEffect, useRef } from 'react';
import { useAsync } from 'hooks/useAsync';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import { TableButton } from 'components/common/Button/TableButton';
import { Modal } from 'components/common/Modal/Modal';
import { Select } from 'components/common/Select/Select';
import { Filter, GridContainer } from 'styles/style';
import { hdoInstance } from 'apis/hdoInstance';

export const CgDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, fetchData] = useAsync<string>('/codelookup/area', [], true);

  useEffect(() => {
    void fetchData();
  }, []);

  // console.log(state);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const emptyFunction: () => void = () => {
    // 비워져 있는 함수
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const adGrid = useRef<AUIGrid>(null);
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'isActive',
      headerText: '',
      headerRenderer: {
        type: IGrid.headerRendererKind.CheckBoxHeaderRenderer,
        // 헤더의 체크박스가 상호 의존적인 역할을 할지 여부(기본값:false)
        // dependentMode 는 renderer 의 type 으로 CheckBoxEditRenderer 를 정의할 때만 활성화됨.
        // true 설정했을 때 클릭하면 해당 열의 필드(데모 상은 isActive 필드)의 모든 데이터를 true, false 로 자동 바꿈
        dependentMode: true,
      },
      renderer: {
        type: IGrid.RendererKind.CheckBoxEditRenderer,
        editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
      },
      width: '5%',
      minWidth: 50,
    },
    {
      dataField: 'check_no',
      headerText: '번호',
      width: '7%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'check_station_id',
      headerText: '충전소ID',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'check_station_name',
      headerText: '충전소명',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'check_area1',
      headerText: '부문',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'check_area2',
      headerText: '지사',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_area1',
      headerText: '부문',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_area2',
      headerText: '지사',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_auth',
      headerText: '권한',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_join',
      headerText: '가입일',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_lately',
      headerText: '최근로그인',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'ad_edit',
      headerText:
        '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width:100%;height:auto;padding: 0.5rem;">',
      width: '5%',
      minWidth: 50,
      style: 'text-center',
    },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 500,
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
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
  const setupGridEvents = () => {
    const grid = adGrid.current as AUIGrid;
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
  const requestGridData = () => {
    const grid = adGrid.current as AUIGrid;
    grid.showAjaxLoader();
    const axios = hdoInstance();
    axios
      .get('/assets/data/admin.json')
      .then((result) => {
        grid.setGridData(result.data);
        grid.removeAjaxLoader();
      })
      .catch(function (error) {
        console.log(error.toJSON());
      });
  };
  return (
    <>
      <Filter>
        <Select
          label="부문"
          options={[
            { value: 'all', label: '전체' },
            { value: 'center', label: '중부' },
            { value: 'south', label: '남부' },
          ]}
        />
        <Select
          label="지사"
          options={[
            { value: 'all', label: '전체' },
            { value: 'v1', label: '경기' },
            { value: 'v2', label: '대구' },
            { value: 'v3', label: '서울' },
            { value: 'v4', label: '부산' },
            { value: 'v4', label: '등등' },
          ]}
        />
        <Select
          label="권한"
          options={[
            { value: 'all', label: '전체' },
            { value: 'v1', label: '임원' },
            { value: 'v2', label: '관리자' },
            { value: 'v3', label: '마케팅' },
            { value: 'v4', label: '시스템 운영' },
            { value: 'v4', label: 'CS' },
          ]}
        />
      </Filter>

      <GridContainer>
        <TableButton
          label="HDO관리자 목록"
          excel={emptyFunction}
          inactive={emptyFunction}
          register={handleOpenModal}
        />
        <AUIGrid
          ref={adGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
        <div className="tb-footer">
          <div className="show-list">
            <span>Showing</span>
            <div className="hd-select">
              <select>
                <option value="0">100</option>
                <option value="1">200</option>
                <option value="2">300</option>
              </select>
            </div>
            <span>Users out of 100</span>
          </div>
          <ul className="pagination">
            <li className="page-item first">
              <a href="#" className="page-link icon-arrow-first">
                First
              </a>
            </li>
            <li className="page-item prev">
              <a href="#" className="page-link icon-arrow-prev">
                Previous
              </a>
            </li>
            <li className="page-item active">
              <a href="#" className="page-link">
                1
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                2
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                3
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                4
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                5
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                6
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                7
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                8
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                9
              </a>
            </li>
            <li className="page-item">
              <a href="#" className="page-link">
                10
              </a>
            </li>
            <li className="page-item next">
              <a href="#" className="page-link icon-arrow-next">
                Next
              </a>
            </li>
            <li className="page-item last">
              <a href="#" className="page-link icon-arrow-last">
                Last
              </a>
            </li>
          </ul>
        </div>
      </GridContainer>
      <Modal title="충전소 등록" open={isModalOpen} close={handleCloseModal}>
        ㅇㅈ
      </Modal>
    </>
  );
};
