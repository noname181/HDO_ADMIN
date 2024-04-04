import { useEffect, useState, useRef } from 'react';
import * as IGrid from 'aui-grid';
import 'AUI/AUIGrid/style.css';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { GridContainer } from 'styles/style';
import { TableButton } from 'components/common/Button/TableButton';
import { Button } from 'components/common/Button/Button';
import { hdoInstance } from 'apis/hdoInstance';

interface unitPriceHeaderData {
  desc: string;
  useYN: string;
  id: string;
}

interface unitPriceDetailData {
  baseTime: string;
  price: string;
}

interface UnitPriceTableModalProps {
  close: () => void;
  onDataSelect: (data: any) => void;
  parentData: IGrid.CellClickEvent | undefined;
}

export const UnitPriceTableModal = ({
  close,
  onDataSelect,
  parentData,
}: UnitPriceTableModalProps) => {
  const unitPriceGrid = useRef<AUIGrid>(null);
  const timeTable1 = useRef<AUIGrid>(null);
  const timeTable2 = useRef<AUIGrid>(null);
  const [addRowHeaderData, setAddRowHeaderData] =
    useState<unitPriceHeaderData | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  const inactive = () => {
    close();
  };

  // 선택 이벤트
  const selectPriceUnitData = () => {
    // console.log(selectedData);
    const updatedSelectedData = {
      ...selectedData,
      rowIndex: parentData?.rowIndex,
    };
    onDataSelect(updatedSelectedData);
    close();
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
    // 코드 확인
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
      formatString: 'yyyy/mm/dd',
      dataType: 'date',
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
        disabledFunction: (rowIndex, columnIndex, value, item) => {
          return true;
        },
      },
    },
    {
      dataField: 'desc',
      headerText: '타임테이블 명칭',
      width: 300,
      editable: false,
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
      editable: false,
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
      editable: false,
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
    height: 500,
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    width: 700,
    rowHeight: 40,
  };

  const tpGridProps: IGrid.Props = {
    height: 500,
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    width: 200,
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
      // console.log(event.item);
      searchDetailData(event.item.id);
      setSelectedData(event.item);
    });
  };

  const setupTp1GridEvents = () => {
    const tpgrid1 = timeTable1.current as AUIGrid;
    tpgrid1.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log('ready Event tpgrid', event);
    });
  };
  const setupTp2GridEvents = () => {
    const tpgrid2 = timeTable2.current as AUIGrid;
    tpgrid2.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log('ready Event tpgrid', event);
    });
  };

  // 각 grid에 대한 함수 따로 정의

  return (
    <>
      <GridContainer>
        <div
          id="parentValue"
          style={{ display: 'block', marginBottom: '10px' }}
        >
          <label>
            시작일 : <span>{parentData?.item.fromDate}&nbsp;&nbsp;</span>
          </label>
          <label style={{ marginLeft: '10xp' }}>
            종료일 :
            <span>
              {parentData?.item.toDate !== ''
                ? parentData?.item.toDate
                : '9999/12/31'}
            </span>
          </label>
        </div>
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
        <div style={{ position: 'relative' }}>
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
                alt="선택"
                onClick={selectPriceUnitData}
              >
                선택
              </Button>
            </div>
          </div>
        </div>
      </GridContainer>
    </>
  );
};
