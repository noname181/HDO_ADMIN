/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef, useContext, useState } from 'react';

import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

import dayjs from 'dayjs';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import { StyledInput } from 'components/common/test/Styled.ant';

import { DefaultDiv, GridHeader } from 'styles/style';

import { useGetListWtTrigger } from 'hooks/useGetListWt';
import { TabsContext } from 'components/common/Tab/Tabs';
import { LabelWrap } from 'components/common/Form/Form';
import ChargerModelFWRegister from './ChargerModelFWRegister';
import { hdoInstance } from 'apis/hdoInstance';
import { saveAs } from 'file-saver';
import axios, { AxiosError } from 'axios';

interface IDownloadFile {
  url: string;
  name: string;
}

// F/W modal main
const ChargerModelFWGrid = ({
  chargerModelData,
  setIsModalOpen,
  reload,
}: any) => {
  const context = useContext(TabsContext);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fwLastVer, setfwLastVer] = useState(0.1);

  const { loading, error, data, getData } = useGetListWtTrigger<any>();

  useEffect(() => {
    if (chargerModelData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/model-firmware?modelId=${chargerModelData.id}`,
      });
      setIsModalOpen(true);
    }
  }, [chargerModelData]);

  useEffect(() => {
    if (state.isSuccess) {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/model-firmware?modelId=${chargerModelData.id}`,
      });
      setState({
        ...state,
        isSuccess: false,
      });
      // reload data of charger-model list page
      reload();
    }
  }, [state]);
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  // const axiosInstance = hdoInstance();
  const handleDownloadFile = async (event: IGrid.ButtonClickEvent) => {
    const fileURL = event.item.fwFileUrl;
    // const fileName = event.item.fwFileName;
    if (!fileURL || fileURL === '') {
      setAlertModal((prev) => ({
        ...prev,
        open: true,
        content: '다운로드할 파일이 없습니다.',
      }));
      return;
    }
    // window.location.href = fileURL;
    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const url = fileURL;
    const spFileName = url.split('/').pop();
    if (isKoreanText(spFileName as string)) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        content: '한글파일명은 지원하지 않습니다.',
      });
      return;
    }
    axios
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/download-file?path=upload/${spFileName}`, {
        responseType: 'blob',
        timeout: 7200000,
      })
      .then((response) => {
        const blob = new Blob([response?.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = spFileName ?? '충전기 전송파일 관리';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const chargerModelFWGrid = useRef<AUIGrid>(null);
  const grid = chargerModelFWGrid.current as AUIGrid;
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 500,
    autoGridHeight: false,
    fillColumnSizeMode: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    // editable: false,
    selectionMode: 'multipleRows',
    copySingleCellOnRowMode: true,
  };
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'fwVer',
      headerText: 'FW 버전',
      width: '15%',
      minWidth: 50,
      editable: false,
      style: 'text-center',
    },
    {
      dataField: 'fwFileName',
      headerText: 'FW 파일명',
      editable: true,
      style: 'text-center',
    },
    {
      dataField: 'down',
      headerText: '다운로드',
      width: 120,
      style: 'text-center',

      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '다운로드',
        onClick: handleDownloadFile,
      },
    },
    // {
    //   dataField: 'fwFileUrl',
    //   headerText: 'FW URL',
    //   editable: false,
    //   // renderer: {
    //   //   type: IGrid.RendererKind.ButtonRenderer,
    //   //   onClick: (event) => {
    //   //     downloadURI(event.text, 'temp');
    //   //   },
    //   // },
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return '다운로드';
    //   },
    // },
    {
      dataField: 'isLast',
      headerText: '최신버전',
      width: '15%',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return 'O';
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'createdAt',
      headerText: '등록일',
      width: '15%',
    },
    // {
    //   width: '15%',
    //   dataField: 'manufacturerId',
    //   headerText: '등록일',
    //   style: 'text-center',

    //   labelFunction: function (_rowIndex, _columnIndex, value) {
    //     return dayjs(value).format('YY-MM-DD');
    //   },
    // },
  ];

  // const downloadFile = (fileURL: string) => {
  //   if (!fileURL || fileURL === '') {
  //     setAlertModal((prev) => ({
  //       ...prev,
  //       open: true,
  //       content: '다운로드할 파일이 없습니다.',
  //     }));
  //     return;
  //   }
  //   const url = fileURL;
  //   const spFileName = url.split('/').pop();
  //   const axios = hdoInstance();
  //   const accessToken = localStorage.getItem('accessToken') ?? '';
  //   if (!accessToken) {
  //     return;
  //   }

  //   axios
  //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //     .get(`/download-file/${spFileName}`, {
  //       headers: {
  //         Authorization: accessToken,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then((response) => {
  //       const blob = new Blob([response.data]);
  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(blob);
  //       link.target = '_blank';
  //       link.download = spFileName ?? '충전기 전송파일 관리';
  //       link.click();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  useEffect(() => {
    if (context.selectedIndex === '2') {
      const grid = chargerModelFWGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);

  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.setGridData(data);
      let lastVer: number = data?.[0]?.fwVer ?? 0;
      data?.forEach((value) => {
        if (value.fwVer > lastVer) {
          lastVer = value.fwVer;
        }
      });
      // console.log(lastVer);
      setfwLastVer(+lastVer + +0.1);
    }
  }, [loading, data]);

  return (
    <DefaultDiv>
      <GridHeader between>
        <div style={{ display: 'flex', gap: '20px' }}>
          <LabelWrap label="모델 ID">
            <StyledInput
              readOnly
              value={chargerModelData.modelCode ?? '에러'}
            />
          </LabelWrap>
          <LabelWrap label="모델명">
            <StyledInput
              readOnly
              value={chargerModelData.modelName ?? '에러'}
            />
          </LabelWrap>
        </div>
        <ChargerModelFWRegister
          chargerModelData={chargerModelData}
          state={state}
          setState={setState}
          setfwLastVer={setfwLastVer}
          fwLastVer={fwLastVer}
        />
      </GridHeader>
      <AUIGrid
        ref={chargerModelFWGrid}
        columnLayout={columnLayout}
        gridProps={gridProps}
      />
    </DefaultDiv>
  );
};

function downloadURI(uri: string, name: any) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // delete link;
}

export default ChargerModelFWGrid;
