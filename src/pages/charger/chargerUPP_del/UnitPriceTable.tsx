import { useEffect, useState, useRef } from 'react';
import * as IGrid from 'aui-grid';
import 'AUI/AUIGrid/style.css';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { GridContainer, Filter } from 'styles/style';
import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import { TableButton } from 'components/common/Button/TableButton';
import { Button } from 'components/common/Button/Button';
import { hdoInstance } from 'apis/hdoInstance';

import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface unitPriceHeaderData {
  desc: string;
  useYN: string;
  id: string;
}

interface unitPriceDetailData {
  baseTime: string;
  price: string;
}

export const UnitPriceTable = () => {
  const unitPriceGrid = useRef<AUIGrid>(null);
  const timeTable1 = useRef<AUIGrid>(null);
  const timeTable2 = useRef<AUIGrid>(null);
  const [addRowHeaderData, setAddRowHeaderData] =
    useState<unitPriceHeaderData | null>(null);
  const [addRowDetailData, setAddRowDetailData] = useState<
    unitPriceDetailData[] | null
  >(null);
  const [textInput, setTextInput] = useState('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // 행 추가, 삽입
  const addRow = () => {
    const newChargerModel = {
      registDate: '',
      registerId: '', // generate a unique ID for the new row
      useYN: '사용 가능',
      desc: '',
    };

    const grid = unitPriceGrid.current as AUIGrid;
    grid.addRow(newChargerModel, 'first');
    setDefaultTimeData();
    // console.log('확인');
  };

  const handleInactiveFunction = () => {
    console.log('삭제');
  };

  const emptyFunction = () => {
    console.log('엑셀');
  };

  const handleTextInputChange = (value: string) => {
    console.log('inputText');
  };

  const register = () => {
    console.log('register');
  };
  const inactive = () => {
    console.log('취소');
  };

  // Grid 저장 이벤트
  const addPriceUnitData = () => {
    const tpgrid1 = timeTable1.current as AUIGrid;
    const tpgrid2 = timeTable2.current as AUIGrid;
    const tpgrid2OrgData = tpgrid2.getOrgGridData();
    const tpgrid1OrgData = tpgrid1.getOrgGridData();
    // console.log(addRowHeaderData);
    const addRowData = [
      {
        addRowHeaderDataKey: addRowHeaderData,
        tpgrid1OrgDataKey: tpgrid1OrgData,
        tpgrid2OrgDataKey: tpgrid2OrgData,
      },
    ];
    // console.log(addRowData);

    // 유효성 검사 실행 -- > price가 0 또는 null인 경우 alert 띄우기
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiUrl = `${rootUrl}/create-unit-price-table`;
    const axios = hdoInstance();
    axios
      .post(apiUrl, addRowData)
      .then((response) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
      })
      .catch((error) => {
        // 요청이 실패하거나 오류가 발생했을 때 처리할 로직
        console.error(error);
      });
  };

  // 시간 grid 초기 셋팅
  const setDefaultTimeData = () => {
    const timeTable1Data = [
      { baseTime: '00:00', price: 0 },
      { baseTime: '01:00', price: 0 },
      { baseTime: '02:00', price: 0 },
      { baseTime: '03:00', price: 0 },
      { baseTime: '04:00', price: 0 },
      { baseTime: '05:00', price: 0 },
      { baseTime: '06:00', price: 0 },
      { baseTime: '07:00', price: 0 },
      { baseTime: '08:00', price: 0 },
      { baseTime: '09:00', price: 0 },
      { baseTime: '10:00', price: 0 },
      { baseTime: '11:00', price: 0 },
    ];

    const timeTable2Data = [
      { baseTime: '12:00', price: 0 },
      { baseTime: '13:00', price: 0 },
      { baseTime: '14:00', price: 0 },
      { baseTime: '15:00', price: 0 },
      { baseTime: '16:00', price: 0 },
      { baseTime: '17:00', price: 0 },
      { baseTime: '18:00', price: 0 },
      { baseTime: '19:00', price: 0 },
      { baseTime: '20:00', price: 0 },
      { baseTime: '21:00', price: 0 },
      { baseTime: '22:00', price: 0 },
      { baseTime: '23:00', price: 0 },
    ];

    const tpgrid1 = timeTable1.current as AUIGrid;
    tpgrid1.setGridData(timeTable1Data);

    const tpgrid2 = timeTable2.current as AUIGrid;
    tpgrid2.setGridData(timeTable2Data);
  };
  // header 데이터 조회
  const searchUPTData = () => {
    // console.log('확인');
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiModelUrl = `${rootUrl}/read-unit-price-table`;

    // 추후 검색 조건 필요
    const axios = hdoInstance();
    axios
      // .get(apiModelUrl, {
      //   params: {
      //     manufacturerId: '', // 제조사 ID 값을 지정해야 합니다.
      //     modelName: selectedModelName, // 모델명 값을 지정해야 합니다.
      //   },
      // })
      .get(apiModelUrl)
      .then((response) => {
        setAddRowHeaderData(response.data);
        const grid = unitPriceGrid.current as AUIGrid;
        grid.setGridData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // detail data 조회
  const searchDetailData = (upTimeTableIdData: any) => {
    // console.log('확인', upTimeTableIdData);
    const rootUrl = process.env.REACT_APP_API_URL;
    // 확인
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiModelUrl = `${rootUrl}/read-upt-detail`;

    // 추후 검색 조건 필요
    const axios = hdoInstance();
    axios
      .get(apiModelUrl, {
        params: {
          upTimeTableId: upTimeTableIdData, // 모델명 값을 지정해야 합니다.
        },
      })
      .then((response) => {
        setDetailData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setDetailData = (data: any) => {
    const dataDetail1 = data.slice(0, 12);
    const dataDetail2 = data.slice(12, 24);

    const detailGrid1 = timeTable1.current as AUIGrid;
    const detailGrid2 = timeTable2.current as AUIGrid;

    detailGrid1.setGridData(dataDetail1);
    detailGrid2.setGridData(dataDetail2);
  };

  const upColumnLayout: IGrid.Column[] = [
    // formmat 필요 yyyy-mm-dd로 변경
    {
      dataField: 'updatedAt',
      headerText: '등록일',
      width: 100,
      editable: false,
      style: 'text-center',
    },
    {
      dataField: 'updatedWho',
      headerText: '등록자',
      width: 80,
      editable: false,
      style: 'text-center',
    },
    // select box 적용 필요
    {
      dataField: 'useYN',
      headerText: '사용여부',
      width: 100,
      editable: true,
      style: 'text-center',

      renderer: {
        type: IGrid.EditRendererKind.DropDownListRenderer,
        list: [
          { code: true, value: '사용' },
          { code: false, value: '미사용' },
        ],
        keyField: 'code',
        valueField: 'value',
      },
    },
    {
      dataField: 'desc',
      headerText: '타임테이블 명칭',
      width: 300,
      style: 'text-center',
    },
    {
      dataField: 'id',
      headerText: '아이디',
      visible: false,
      style: 'text-center',
    },
  ];

  const tpColumnLayout1: IGrid.Column[] = [
    {
      dataField: 'baseTime',
      headerText: '시간',
      width: 50,
      editable: false,
      style: 'text-center',
    },
    {
      dataField: 'price',
      headerText: '단가',
      width: 120,
      style: 'text-center',
    },
  ];

  const tpColumnLayout2: IGrid.Column[] = [
    {
      dataField: 'baseTime',
      headerText: '시간',
      width: 50,
      editable: false,
      style: 'text-center',
    },
    {
      dataField: 'price',
      headerText: '단가',
      width: 120,
      style: 'text-center',
    },
  ];

  useEffect(() => {
    setupUpGridEvents();
    setupTp1GridEvents();
    setupTp2GridEvents();
    searchUPTData();
    // return () => {
    //   console.log('마운트 확인');
    // };
  }, []);

  const gridProps: IGrid.Props = {
    width: 1000,
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  const tpGridProps: IGrid.Props = {
    height: 450,
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    width: 300,
    rowHeight: 40,
    showRowNumColumn: false,
  };

  // AUIGrid 이벤트 함수
  const setupUpGridEvents = () => {
    const upgrid = unitPriceGrid.current as AUIGrid;
    // upgrid 그리드 ready 이벤트 바인딩
    upgrid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log('ready Event 2', event);
    });
    // 셀 클릭 이벤트
    upgrid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      // console.log(event.item.id);
      searchDetailData(event.item.id);
    });
    // 에디트 이벤트
    upgrid.bind(
      IGrid.EventKind.CellEditEnd,
      (event: IGrid.CellEditEndEvent) => {
        setAddRowHeaderData(event.item);
      },
    );
  };

  const setupTp1GridEvents = () => {
    const tpgrid1 = timeTable1.current as AUIGrid;
    tpgrid1.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log('ready Event tpgrid', event);
    });
    // 에디트 이벤트
    tpgrid1.bind(
      IGrid.EventKind.CellEditEnd,
      (event: IGrid.CellEditEndEvent) => {
        // console.log(event);
      },
    );
  };
  const setupTp2GridEvents = () => {
    const tpgrid2 = timeTable2.current as AUIGrid;
    tpgrid2.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log('ready Event tpgrid', event);
    });
    // 에디트 이벤트
    tpgrid2.bind(
      IGrid.EventKind.CellEditEnd,
      (event: IGrid.CellEditEndEvent) => {
        // console.log(event);
      },
    );
  };

  // 각 grid에 대한 함수 따로 정의

  return (
    <>
      <Filter>
        <Select
          label="사용여부"
          options={[
            { value: 'all', label: '전체' },
            { value: 'center', label: '사용' },
            { value: 'south', label: '미사용' },
          ]}
        />
        <Input
          label="테이블명"
          value={textInput}
          onChange={(e) => {
            handleTextInputChange(e.target.value);
          }}
        />
        <button onClick={searchUPTData}>검색</button>
      </Filter>
      <GridContainer height="calc(100vh - 15.7rem)">
        <TableButton
          label="단가 타임테이블"
          excel={emptyFunction}
          inactive={handleInactiveFunction}
          register={addRow}
        />
        <div style={{ display: 'flex' }}>
          <div>
            <AUIGrid
              ref={unitPriceGrid}
              columnLayout={upColumnLayout}
              gridProps={gridProps}
            />
          </div>
          <div
            style={{
              width: '5px',
              backgroundColor: '#495057',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          ></div>
          <div>
            <div style={{ display: 'flex' }}>
              <div>
                <AUIGrid
                  ref={timeTable1}
                  columnLayout={tpColumnLayout1}
                  gridProps={tpGridProps}
                />
              </div>
              <div style={{ marginLeft: '10px' }}></div>
              <div>
                <AUIGrid
                  ref={timeTable2}
                  columnLayout={tpColumnLayout2}
                  gridProps={tpGridProps}
                />
              </div>
            </div>
            <div style={{ position: 'relative', height: '50px' }}>
              <div style={{ position: 'absolute', right: 0 }}>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  <div>
                    <Button
                      size="md"
                      color="reset"
                      icon="/assets/img/icon/icon-trash.png"
                      alt="비활성"
                      onClick={inactive}
                    >
                      취소
                    </Button>
                  </div>
                  <div style={{ marginRight: '5px' }}></div>
                  <Button
                    size="md"
                    color="primary"
                    icon="/assets/img/icon/icon-add-w.png"
                    alt="등록"
                    onClick={addPriceUnitData}
                  >
                    수정/등록
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
