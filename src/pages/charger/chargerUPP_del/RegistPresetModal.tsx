import React, { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as IGrid from 'aui-grid';
import 'AUI/AUIGrid/style.css';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { Button } from '../../../components/common/Button/Button';
import { GridContainer } from 'styles/style';
import { Modal } from 'components/common/Modal/Modal';
import { UnitPriceTableModal } from './UnitPriceTableModal';
import { hdoInstance } from 'apis/hdoInstance';

import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface presetData {
  fromDate: Date;
  toDate: string;
  tableTitle: string;
}

interface RegistPresetModalProps {
  propsData: IGrid.CellClickEvent | undefined;
}

export const RegistPresetModal: React.FC<RegistPresetModalProps> = ({
  propsData,
}) => {
  // 변수 선언
  const preSetGrid = useRef<AUIGrid>(null);
  const [isFWModalOpen, setIsFwmodalOpen] = useState(false);
  const [, setSelectedData] = useState(null);
  const [modalData, setModalData] = useState<IGrid.CellClickEvent | undefined>(
    undefined,
  );
  const [title, settitle] = useState('');
  const [desc, setDesc] = useState('');
  const [headerId, setHeaderId] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // 함수 정의
  const handleFWCloseModal = () => {
    setIsFwmodalOpen(false);
  };
  const clickPreSetModal = (rowData: presetData) => {
    // console.log(rowData);
    setIsFwmodalOpen(true);
  };
  const handleDataSelect = (handledata: any) => {
    setSelectedData(handledata);
    const gird = preSetGrid.current as AUIGrid;
    gird.setCellValue(handledata.rowIndex, 'tableTitle', handledata.desc);
    gird.setCellValue(handledata.rowIndex, 'upTimeTableId', handledata.id);
    // 선택된 데이터 처리 로직을 수행할 수 있습니다.
    // console.log('부모창 확인 ', handledata);
  };

  // 현재 날짜를 yyyy/mm/dd 형식으로 반환하는 함수
  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 행 추가, 삽입
  const addRow = () => {
    // console.log(getCurrentDate);
    // console.log(getCurrentDate());
    const newChargerModel = {
      fromDate: getCurrentDate(),
      toDate: '9999/12/31',
      tableTitle: '',
    };

    const grid = preSetGrid.current as AUIGrid;
    const data = grid.getOrgGridData();
    // console.log(data);
    grid.addRow(newChargerModel, 'first');
    // console.log('확인');
  };

  const confirmData = () => {
    // console.log('확인 과정');

    const grid = preSetGrid.current as AUIGrid;
    const data = grid.getOrgGridData();
    const fromDateArray: Date[] = data.map(
      (rowData: presetData) => rowData.fromDate,
    );

    const duplicateDates: Date[] = [];

    // console.log(data);

    fromDateArray.forEach((date, index) => {
      // console.log('date : ', date);
      //  console.log(
      //   'formDateArray.indexOf(date) : ',
      //   fromDateArray.indexOf(date),
      // );

      if (
        fromDateArray.indexOf(date) !== index &&
        !duplicateDates.includes(date)
      ) {
        duplicateDates.push(date);
      }
    });
    if (duplicateDates.length > 0) {
      alert(`중복된 시작 날짜가 존재합니다`);
    } else {
      sortDataByFromDate();
      setShowButton(true);
    }
  };

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const sortDataByFromDate = () => {
    const grid = preSetGrid.current as AUIGrid;
    const data = grid.getOrgGridData();

    data.sort((a: presetData, b: presetData) => {
      const dateA = new Date(a.fromDate);
      const dateB = new Date(b.fromDate);

      return dateA.getTime() - dateB.getTime();
    });

    for (let i = 0; i < data.length; i++) {
      if (i + 1 < data.length) {
        // console.log(data);
        const prevFromDate = new Date(data[i + 1].fromDate);
        // console.log(prevFromDate);
        prevFromDate.setDate(prevFromDate.getDate() - 1);
        // console.log(prevFromDate);
        data[i].toDate = formatDate(prevFromDate);
      }
    }
    // console.log(data);
    grid.setGridData(data);
  };
  const handlePresetNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    settitle(event.target.value);
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDesc(event.target.value);
  };

  useEffect(() => {
    // console.log(propsData);
    if (propsData) {
      setDesc(propsData.item.desc);
      settitle(propsData.item.Title);
      setHeaderId(propsData.item.id);
      search();
    }
  }, [propsData]);

  useEffect(() => {
    const grid = preSetGrid.current as AUIGrid;
    grid.refresh();
    setupGridEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *******************API**************************
  // 저장 API
  const onSave = () => {
    const grid = preSetGrid.current as AUIGrid;
    const addRowData = grid.getOrgGridData();
    const headerData = {
      title,
      desc,
      headerId,
    };

    const detailsData = addRowData.map((rowData: presetData) => ({
      details: rowData,
    }));

    const requestData = {
      header: headerData,
      detail: detailsData,
    };
    // console.log(requestData);
    // const apiUrl = 'http://localhost:8080/unit-price'; // 로컬
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiUrl = `${rootUrl}/unit-price`;
    const axios = hdoInstance();
    axios
      .post(apiUrl, requestData)
      .then((response) => {
        // 성공적으로 응답을 받았을 때 처리할 로직
        // console.log(response);
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

  // 조회
  const search = () => {
    // console.log('search 확인 :', propsData?.item);
    const paramKey = { id: propsData?.item.id };
    // console.log('search 확인1 :', paramKey);
    const apiUrl = 'http://localhost:8080/unit-price-detail'; // 로컬
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // const apiUrl = `${rootUrl}/unit-price-detail`;
    const axios = hdoInstance();
    axios
      .get(apiUrl, {
        params: paramKey,
      })
      .then((response) => {
        // console.log('결과 확인 ', response);
        const grid = preSetGrid.current as AUIGrid;
        grid.setGridData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 그리드
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'fromDate',
      headerText: '시작일',
      width: 100,
      formatString: 'yyyy/mm/dd',
      dataType: 'date',
      style: 'text-center',

      renderer: {
        type: IGrid.RendererKind.IconRenderer,
        iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
        iconHeight: 16,
        iconPosition: 'aisleRight',
        iconTableRef: {
          // icon 값 참조할 테이블 레퍼런스
          default: 'assets/img/icon/calendar-icon.png', // default
        },
        onClick: (event: IGrid.IconClickEvent) => {
          // console.log(event);
          // 달력 아이콘 클릭하면 실제로 달력을 띄움.
          // 즉, 수정으로 진입함.
          preSetGrid.current?.openInputer();
        },
      },
      editRenderer: {
        type: IGrid.EditRendererKind.CalendarRenderer,
        defaultFormat: 'yyyy/mm/dd',
        showEditorBtn: false,
        showEditorBtnOver: false,
        onlyCalendar: true,
        showExtraDays: true,
        validator: function (
          oldValue,
          newValue,
          item,
          dataField,
          fromClipboard,
          which,
        ) {
          const selectedDate = new Date(newValue);
          const today = new Date();
          if (selectedDate < today) {
            return {
              validate: false,
              message: '오늘 이전의 날짜는 선택할 수 없습니다.',
            };
          }
          return { validate: true };
        },
      },
    },
    {
      dataField: 'toDate',
      headerText: '종료일',
      width: 100,
      formatString: 'yyyy/mm/dd',
      dataType: 'date',
      style: 'text-center',

      renderer: {
        type: IGrid.RendererKind.IconRenderer,
        iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
        iconHeight: 16,
        iconPosition: 'aisleRight',
        iconTableRef: {
          // icon 값 참조할 테이블 레퍼런스
          default: 'assets/img/icon/calendar-icon.png', // default
        },
        onClick: (event: IGrid.IconClickEvent) => {
          // console.log(event);
          // 달력 아이콘 클릭하면 실제로 달력을 띄움.
          // 즉, 수정으로 진입함.
          preSetGrid.current?.openInputer();
        },
      },
      editRenderer: {
        type: IGrid.EditRendererKind.CalendarRenderer,
        defaultFormat: 'yyyy/mm/dd',
        showEditorBtn: false,
        showEditorBtnOver: false,
        onlyCalendar: true,
        showExtraDays: true,
      },
      editable: false,
    },
    {
      dataField: 'tableTitle',
      headerText: '타임테이블',
      width: 120,
      style: 'text-center',
    },
    {
      dataField: 'upTimeTableId',
      headerText: '테이블 아이디',
      width: 120,
      style: 'text-center',

      // visible: false,
    },
  ];
  const gridProps: IGrid.Props = {
    height: 480,
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    width: 800,
    rowHeight: 40,
  };

  const setupGridEvents = () => {
    const grid = preSetGrid.current as AUIGrid;
    grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      if (event.dataField === 'tableTitle') {
        clickPreSetModal(event.item);
        setModalData(event);
      }
    });
    grid.bind(IGrid.EventKind.CellEditEnd, (event: IGrid.CellEditEndEvent) => {
      // console.log(event);
      const selectedDate = new Date(event.item.fromDate);
      const today = new Date(); // 현재 날짜
      today.setHours(0, 0, 0, 0); // 현재 날짜의 시간을 00:00:00으로 설정
      if (selectedDate < today) {
        alert('오늘보다 이전 날짜를 선택할 수 없습니다.');
        grid.setCellValue(event.rowIndex, 'fromDate', getCurrentDate());
      }
    });
  };

  return (
    <>
      <GridContainer>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '20%' }}>
            <label
              style={{
                marginBottom: '10px',
                display: 'block',
                fontSize: '15px',
              }}
            >
              Pre-Set명 *
            </label>
            <input
              type="text"
              style={{
                width: '250px',
                height: '40px',
                border: '1.5px solid #A5A8B1',
                borderRadius: '5px',
                textIndent: '10px',
              }}
              value={title}
              onChange={handlePresetNameChange}
            ></input>
            <label
              style={{
                display: 'block',
                marginTop: '15px',
                marginBottom: '5px',
                fontSize: '18px',
              }}
            >
              설명 *
            </label>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '700',
              }}
            >
              설명은 주요 변경 시점과 <br /> 해당 단가 등을 기록하세요
            </label>
            <textarea
              style={{
                width: '250px',
                height: '385px',
                border: '1.5px solid #A5A8B1',
                borderRadius: '5px',
                textIndent: '10px',
                display: 'block',
                resize: 'none',
                paddingTop: '10px',
              }}
              value={desc}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <div
            style={{
              border: '2px solid #A5A8B1',
              marginLeft: '50px',
              marginRight: '30px',
              borderRadius: '50px',
            }}
          ></div>
          <div style={{ width: '80%' }}>
            <div style={{ height: '50px' }}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <div
                  style={{ position: 'absolute', left: '0', display: 'flex' }}
                >
                  <div style={{ marginRight: '10px' }}>
                    <Button
                      size="sm"
                      color="sub"
                      icon="/assets/img/icon/icon-x.png"
                      onClick={addRow}
                    >
                      삭제
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      color="primary"
                      icon="/assets/img/icon/icon-add-w.png"
                      onClick={addRow}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <AUIGrid
              ref={preSetGrid}
              columnLayout={columnLayout}
              gridProps={gridProps}
            />
            <div style={{ height: '50px' }}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <div
                  style={{ position: 'absolute', right: '0', display: 'flex' }}
                >
                  <div style={{ marginRight: '10px' }}>
                    <Button
                      size="sm"
                      color="sub"
                      icon="/assets/img/icon/icon-x.png"
                      onClick={addRow}
                    >
                      취소
                    </Button>
                  </div>
                  <div style={{ marginRight: '10px' }}>
                    <Button
                      size="sm"
                      color="sub"
                      icon="/assets/img/icon/success.png"
                      onClick={confirmData}
                    >
                      검증
                    </Button>
                  </div>
                  <div>
                    {showButton && (
                      <Button
                        size="sm"
                        color="primary"
                        icon="/assets/img/icon/icon-add-w.png"
                        onClick={onSave}
                      >
                        저장
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
      {
        <Modal
          title="단가 타임테이블 선택"
          open={isFWModalOpen}
          close={handleFWCloseModal}
        >
          <UnitPriceTableModal
            close={handleFWCloseModal}
            onDataSelect={handleDataSelect}
            parentData={modalData}
          />
        </Modal>
      }
    </>
  );
};

export default RegistPresetModal;
