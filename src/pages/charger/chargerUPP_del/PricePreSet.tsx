import { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as IGrid from 'aui-grid';
import 'AUI/AUIGrid/style.css';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { GridContainer, Filter } from 'styles/style';
import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import { TableButton } from 'components/common/Button/TableButton';
import { Button } from 'components/common/Button/Button';
import { Modal } from 'components/common/Modal/Modal';
import { RegistPresetModal } from './RegistPresetModal';
import { hdoInstance } from 'apis/hdoInstance';

interface presetData {
  title: string;
  desc: string; // generate a unique ID for the new row
  useYN: boolean;
  chargerCount: string;
  PeriodCount: string;
}

export const PricePreSet = () => {
  // 변수 선언
  const preSetGrid = useRef<AUIGrid>(null);
  const [isFWModalOpen, setIsFwmodalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<
    IGrid.CellClickEvent | undefined
  >(undefined);

  // 함수 정의
  // const emptyFunction = () => {
  //   console.log('엑셀');
  // };
  const handleInactiveFunction = () => {
    console.log('비활성화');
  };
  const handleFWCloseModal = () => {
    setIsFwmodalOpen(false);
    // console.log('모달 닫힌다');
  };
  // 행 추가, 삽입
  const addRow = () => {
    const newChargerModel = {
      title: '',
      desc: '', // generate a unique ID for the new row
      useYN: true,
      chargerCount: '',
      PeriodCount: '',
    };

    const grid = preSetGrid.current as AUIGrid;
    grid.addRow(newChargerModel, 'first');
    // console.log('확인');
  };

  const clickPreSetModal = (event: IGrid.CellClickEvent) => {
    // console.log(event);
    setIsFwmodalOpen(true);
    setSelectedRowData(event);
  };

  useEffect(() => {
    requestUnitPrice();
  }, [isFWModalOpen]);

  useEffect(() => {
    const grid = preSetGrid.current as AUIGrid;
    grid.refresh();
    setupGridEvents();
    requestUnitPrice();
  }, []);

  // 모델 정보 조회
  const requestUnitPrice = () => {
    // const apiModelUrl = 'http://localhost:8080/unit-price'; // 로컬
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiModelUrl = `${rootUrl}/unit-price`;
    // console.log(apiModelUrl);

    const axios = hdoInstance();
    axios
      .get(apiModelUrl, {
        params: {
          useYN: 'all',
        },
      })
      .then((response) => {
        // console.log(response);
        const grid = preSetGrid.current as AUIGrid;
        grid.setGridData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ********그리드*************
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'Title',
      headerText: 'Pre-Set명',
      style: 'text-center',

      width: 100,
    },
    {
      dataField: 'desc',
      headerText: 'Pre-Set 설명',
      style: 'text-center',

      width: 100,
    },
    {
      dataField: 'useYN',
      headerText: '사용여부',
      style: 'text-center',

      width: 120,
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
      dataField: 'Applied',
      headerText: '적용 충전기(수)',
      style: 'text-center',

      width: 200,
    },
    {
      dataField: 'Period',
      headerText: 'Period(수)',
      style: 'text-center',

      width: 100,
    },
    {
      dataField: 'id',
      headerText: 'Period(수)',
      style: 'text-center',

      width: 100,
      visible: false,
    },
  ];

  const gridProps: IGrid.Props = {
    height: 500,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    rowHeight: 40,
    width: 1640,
  };

  const setupGridEvents = () => {
    const grid = preSetGrid.current as AUIGrid;
    grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      if (event.dataField === 'desc') {
        clickPreSetModal(event);
      }
    });
  };
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
      </Filter>
      <GridContainer>
        <TableButton
          label="단가 Pre-Set"
          inactive={handleInactiveFunction}
          register={addRow}
        />
        <AUIGrid
          ref={preSetGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </GridContainer>
      {
        <Modal
          title="프리셋 추가 등록 Modal"
          open={isFWModalOpen}
          close={handleFWCloseModal}
        >
          <RegistPresetModal propsData={selectedRowData} />
        </Modal>
      }
    </>
  );
};
