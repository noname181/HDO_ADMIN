import React, { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { Button } from '../../components/common/Button/Button';
import { Input } from 'components/common/Input/Input';
import { GridContainer } from 'styles/style';
import 'AUI/AUIGrid/style.css';

import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
// interface ChargerModelData {
//   id: string;
//   modelCode: string;
//   modelName: string;
//   maxKw: string;
//   manufacturer: string;
//   speedType: string;
//   connectorType: string;
//   channelCount: string;
//   pncAvailable: string;
//   useYN: string;
//   manufacturerId: string;
// }

interface ChargerModelFWModalProps {
  data: IGrid.ButtonClickEvent | undefined;
}

const ChargerModelFWModal: React.FC<ChargerModelFWModalProps> = ({ data }) => {
  // console.log('data : ', data);
  // hook 변수 선언
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const fwGrid = useRef<AUIGrid>(null);
  const [modelIdtext, setModelIdtext] = useState('');
  const [modelNametext, setModelNametext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 선택된 파일 객체를 저장하는 상태
  const [, setFileName] = useState<string>('파일선택');
  const [addRowData, setAddRowData] = useState({
    fwVer: '',
    isLast: '',
    fwFileName: '',
    fwFileUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 스타일 객체
  const topOutLine: React.CSSProperties = {
    position: 'relative',
  };
  const rowLine: React.CSSProperties = {
    display: 'flex',
    marginBottom: '10px',
  };
  const rightItem: React.CSSProperties = {
    marginLeft: '10px',
  };

  useEffect(() => {
    // console.log('ChargerModelFWModal 마운트됨');
    setupGridEvents();
    if (selectedFile) {
      const newLabelText = selectedFile.name;
      // console.log(newLabelText);
      setFileName(newLabelText);
    }
  }, [selectedFile]);

  useEffect(() => {
    // console.log('데이터 확인', data);
    if (data) {
      setModelIdtext(data.item.modelCode);
      setModelNametext(data.item.modelName);
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const fwFileUpload = () => {
    // console.log('fwFileUpload');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 선택된 파일에 대한 추가 작업 수행
      setSelectedFile(file);
      const newLabelText = file.name;
      const grid = fwGrid.current as AUIGrid;
      grid.setCellValue(0, 'fwFileName', newLabelText);
    }
  };

  const addRow = () => {
    const newChargerModel = {
      fwVer: '',
      fwFileName: '파일 선택', // generate a unique ID for the new row
      fwFileUrl: '',
      isLast: 'true',
      createdBy: '',
      createdAt: '',
      deletedAt: '',
    };

    // setChargerModels((prevChargerModels) => [
    //   ...prevChargerModels,
    //   newChargerModel,
    // ]);

    const grid = fwGrid.current as AUIGrid;
    grid.addRow(newChargerModel, 'first');
  };
  // 조회
  const search = () => {
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiUrl = `${rootUrl}/read-model-firmware`;
    // console.log('search');
    const paramData = {
      modelId: data?.item.id,
    };
    // console.log(paramData);
    const axios = hdoInstance();
    axios
      .get(apiUrl, {
        params: paramData,
      })
      .then((response) => {
        const grid = fwGrid.current as AUIGrid;
        grid.setGridData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 파일 업로드 후 데이터 DB 저장
  const onSave = () => {
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiUrl = `${rootUrl}/firmware`;
    // API 운영 반영시
    // const basicUrl = process.env.REACT_APP_API_URL;
    // // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // const url = `${basicUrl}/firmware`;
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile); // 선택된 파일을 formData에 추가
    }
    const axios = hdoInstance();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        // 성공적으로 응답을 받았을 때 처리할 로직
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        saveGridData(response.data.id, response.data.url);
      })
      .catch((error) => {
        // 요청이 실패하거나 오류가 발생했을 때 처리할 로직
        console.error(error);
      });
    // console.log('실행 확인');
  };

  const saveGridData = (fwFileName: string, fwFileUrl: string) => {
    const modelData = {
      modelCode: data?.item.modelCode,
      modelName: data?.item.modelName,
      modelId: data?.item.id,
    };
    const param = {
      ...modelData,
      ...addRowData,
      fwFileName,
      fwFileUrl,
    };
    // console.log(param);
    const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const apiUrl = `${rootUrl}/create-model-firmware`;
    const axios = hdoInstance();
    axios
      .post(apiUrl, param)
      .then((response) => {
        // console.log(response);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        search();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // AUIGrid 컴포넌트의 참조를 저장하는 변수
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'fwVer',
      headerText: 'FW 버전',
      width: 50,
      style: 'text-center',
    },
    {
      dataField: 'fwFileName',
      headerText: 'FW 파일명',
      width: 250,
      style: 'text-center',

      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        onClick: fwFileUpload,
      },
    },
    {
      dataField: 'fwFileUrl',
      headerText: 'FW URL',
      width: 80,
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'isLast',
      headerText: '최신버전',
      style: 'text-center',

      width: 80,
      editable: true,
      renderer: {
        type: IGrid.EditRendererKind.DropDownListRenderer,
        list: [
          { code: 'true', value: '최신버전' },
          { code: 'false', value: '이전버전' },
        ],
        keyField: 'code',
        valueField: 'value',
        disabledFunction: (rowIndex, columnIndex, value, item) => {
          return item.createdAt !== '';
        },
      },
    },
    {
      dataField: 'createdAt',
      headerText: '등록일',
      width: 80,
      editable: false,
      style: 'text-center',
    },
    {
      dataField: 'createdBy',
      headerText: '등록자',
      width: 130,
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'deletedAt',
      headerText: '활성 상태',
      width: 130,
      visible: false,
      style: 'text-center',
    },
  ];

  const gridProps: IGrid.Props = {
    height: 500,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true,
    showRowNumColumn: true,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
  };

  const setupGridEvents = () => {
    const grid = fwGrid.current as AUIGrid;

    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });

    grid.bind(
      [IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick],
      (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
        // console.log('이벤트 확인 : ', event);
      },
    );
    grid.bind(
      IGrid.EventKind.CellEditBegin,
      // FW 파일명 추가일 경우만 editable:true
      (event: IGrid.CellEditBeginEvent) => {
        // console.log('이벤트 확인 cellEditBegin : ', event);
        if (event.dataField === 'fwFileName') {
          if (!event.item.createdAt) {
            return true;
          } else {
            return false;
          }
        }
      },
    );
    grid.bind(IGrid.EventKind.CellEditEnd, (event: IGrid.CellEditEndEvent) => {
      setAddRowData(event.item);
    });
  };

  return (
    <>
      <GridContainer>
        <div style={topOutLine}>
          <div style={rowLine}>
            <Input
              label="모델 ID"
              value={modelIdtext}
              onChange={(e) => {
                setModelIdtext(e.target.value);
              }}
              isDisabled={true}
            ></Input>
            <div style={rightItem}>
              <Input
                label="모델명"
                value={modelNametext}
                onChange={(e) => {
                  setModelNametext(e.target.value);
                }}
                isDisabled={true}
              ></Input>
            </div>
            <div style={{ position: 'absolute', right: '0' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '5px' }}>
                  <Button
                    size="md"
                    color="primary"
                    icon="/assets/img/icon/icon-add-w.png"
                    alt="FW 추가"
                    onClick={addRow}
                  >
                    FW 추가
                  </Button>
                </div>
                <div>
                  <Button
                    size="md"
                    color="primary"
                    icon="/assets/img/icon/icon-add-w.png"
                    alt="저장"
                    onClick={onSave}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AUIGrid
          ref={fwGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </GridContainer>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ChargerModelFWModal;
