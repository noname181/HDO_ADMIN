import { useEffect, useRef, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import { type StateInterface } from 'interfaces/ICommon';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import UpdateFileRegister from './Model/UpdateFileRegister';
import UpdateFileEdit from './Model/UpdateFileEdit';
import { Button } from 'components/common/Button/Button';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { deleteBatchApi } from 'apis/deleteBatchApi';

interface UpdateFileGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  setCheckRowId: any;
  checkRowId: any;
}
interface EditModelProps {
  isOpen: boolean;
  id: number | null;
}
const UpdateFileGridTable = ({
  loading,
  data,
  state,
  setState,
  setCheckRowId,
  checkRowId,
}: UpdateFileGridTableProps) => {
  const updateFileGrid = useRef<AUIGrid>(null);
  // const [updateFileData, setUpdateFileData] = useState('');
  const [editModelState, setEditModelState] = useState<EditModelProps>({
    isOpen: false,
    id: null,
  });
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [LastVer, setLastVer] = useState(0.1);
  const [LastVer2, setLastVer2] = useState(0.1);

  // const fwFileUpload = (event: IGrid.ButtonClickEvent) => {
  //   downloadFile(event.item.fileURL);
  // };
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  const downloadFile = (fileURL: string) => {
    if (!fileURL || fileURL === '') {
      setAlertModal((prev) => ({
        ...prev,
        open: true,
        content: '다운로드할 파일이 없습니다.',
      }));
      return;
    }

    // window.location.href = fileURL;
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
    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
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
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.code ?? 'api 호출 에러 : 콘솔창 확인',
          content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
        console.error(error);
      });
  };

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'id',
      headerText: 'ID',
      visible: false,
    },
    {
      dataField: 'division',
      headerText: '구분',
      width: '5%',
      minWidth: 50,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'TM') {
          return '약관';
        }
        if (value === 'AD') {
          return '광고';
        }
        return '-';
      },
    },
    {
      dataField: 'version',
      headerText: '버전',
      width: '15%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'fileURL',
      headerText: '파일 URL',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.split('/').pop();
      },
    },
    {
      dataField: 'down',
      headerText: '다운로드',
      width: 120,
      style: 'text-center',

      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '다운로드',
        onClick: (event: IGrid.ButtonClickEvent) => {
          // console.log(event);
          // fwFileUpload(event);
          downloadFile(event?.item?.fileURL);
        },
      },
    },
    {
      dataField: 'newestVersion',
      headerText: '최신버전',
      width: '15%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return 'O';
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'createdBy',
      headerText: '등록자',
      width: '9%',
      minWidth: 50,
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name;
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      style: 'text-center',

      width: 150,
    },
    // {
    //   dataField: 'edit',
    //   headerText:
    //     '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
    //   width: '4%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.IconRenderer,
    //     iconWidth: 18,
    //     iconHeight: 18,
    //     iconTableRef: {
    //       default: './assets/img/icon/icon-edit.png',
    //     },
    //     onClick: function (event) {
    //       setEditModelState({
    //         isOpen: true,
    //         id: event.item.id,
    //       });
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    editable: false,
    selectionMode: 'multipleRows',
    showRowCheckColumn: true,
  };

  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      const grid = updateFileGrid.current as AUIGrid;
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setEditModelState({
            isOpen: true,
            id: event.item.id,
          });
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [
              ...value,
              { id: event.item.id, newestVersion: event.item.newestVersion },
            ]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item.id !== event.item.id,
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
            const dataItems = grid?.getGridData() as Array<{
              id: number;
              newestVersion: boolean;
            }>;
            setCheckRowId(
              dataItems.map((item) => ({
                id: item.id,
                newestVersion: item.newestVersion,
              })),
            );
          } else {
            setCheckRowId([]);
          }
        },
      );
      let lastVeradd: number = 0;
      let lastVer2add: number = 0;
      data?.forEach((value: any) => {
        if (value.division === 'TM') {
          if (value.version > lastVeradd) {
            lastVeradd = value.version;
          }
        }
        if (value.division === 'AD') {
          if (value.version > lastVer2add) {
            lastVer2add = value.version;
          }
        }
      });
      setLastVer(+lastVeradd + +0.1);
      setLastVer2(+lastVer2add + +0.1);
      grid.setGridData(data);
    }
  }, [loading, data]);
  // console.log(editModelState);
  async function onDeleteRow() {
    // console.log(checkRowId);
    // const hasNewestVersion = checkRowId.some((item) => item.newestVersion);
    // if (hasNewestVersion) {
    //   setAlertModal({
    //     ...alertModal,
    //     open: true,
    //     type: 'error',
    //     title: '삭제할 수 없습니다.',
    //     content: '최소 한개 이상의 최신버전이 필요합니다.',
    //   });
    // } else {
    const idsToDelete = checkRowId.map((item: any) => item.id);

    const dataToSend = {
      fileIds: idsToDelete.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/file/delete-batch`,
          data: dataToSend,
        },
        setState,
        (error) => {
          if (error) {
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'error',
              title: '삭제할 수 없습니다.',
              content: '최소 한개 이상의 최신버전이 필요합니다.',
            });
          } else {
            setCheckRowId([]);
          }
        },
      );
    }
    // }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }
  // useEffect(() => {
  //   console.log(checkRowId);
  // }, [checkRowId]);
  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton label="업데이트 파일" myGrid={updateFileGrid}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          * 약관은 .txt 파일, 영상 압축은 1.mp4 ~ 5.mp4 를 압축한 .zip로 업로드
          하세요
        </span>
        <Button
          size="md"
          color="reset"
          icon="/assets/img/icon/icon-trash.png"
          alt="비활성"
          onClick={() => {
            handleDeleteRow();
          }}
        >
          삭제
        </Button>
        <UpdateFileRegister
          state={state}
          setState={setState}
          LastVer={LastVer}
          LastVer2={LastVer2}
        />
      </GridButton>
      {/* <span style={{ display: 'inline-block', paddingBottom: '1rem' }}>
        * 약관은 .txt 파일, 영상 압축은 1.mp4 ~ 5.mp4 를 압축한 .zip로 업로드
        하세요
      </span> */}
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={updateFileGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      {editModelState && (
        <UpdateFileEdit
          state={state}
          setState={setState}
          setEditModelState={setEditModelState}
          editModelState={editModelState}
          setCheckRowId={setCheckRowId}
        />
      )}
    </GridContainer>
  );
};

export default UpdateFileGridTable;
